"use client"

import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion } from "@/app/controllers/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import { Box, Button, CardContent, CircularProgress, TextField, Typography, IconButton, Tooltip } from "@mui/material";
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { use, useContext, useEffect, useRef, useState } from "react";


export default function Page({ params }) {
    const { slug } = use(params);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [assistantAnswer, setAssistantAnswer] = useState("");
    const [translateLoading, setTranslateLoading] = useState(false);
    const hasInitialized = useRef(false);
    const [isEnglishToArabic, setIsEnglishToArabic] = useState(true);
    const [checkDisabled, setCheckDisabled] = useState(false);

    const { 
        setContextPreviousMessage, 
        contextPreviousMessage, 
        setErrorMessage, 
        setShowAlert, 
        setTextButton, 
        setShowFooterButton,
        clearMessages 
    } = useContext(AppContext);

    // Prompt حسب اتجاه الترجمة
    const getPrompt = (direction) => ({
        role: "user",
        content: direction 
        ? `As an English teacher for A2 level students, create ONE simple English sentence that demonstrates the use of "${slug}".

        Requirements:
        - Use clear, common vocabulary appropriate for A2 level
        - The sentence should be between 5-12 words
        - Make it practical and relatable to everyday life
        - Only provide the English sentence, nothing else
        - Do not include translation or explanation

        Example format: "I went to the market yesterday."`
        : `كمعلم للغة العربية لطلاب مستوى A2، أنشئ جملة عربية بسيطة واحدة توضح استخدام "${slug}".

        المتطلبات:
        - استخدم مفردات واضحة وشائعة مناسبة لمستوى A2
        - يجب أن تكون الجملة بين 5-12 كلمة
        - اجعلها عملية ومرتبطة بالحياة اليومية
        - قدم الجملة العربية فقط، لا شيء آخر
        - لا تضمن الترجمة أو الشرح

        مثال: "ذهبت إلى السوق أمس."`
    });

    const loadingTextArray = [
        "الصبر مفتاح الإتقان، انتظر قليلاً وستحصل على جملة لترجمتها.",
        "استمتع بلحظات الانتظار بتحديد معنى هذه الجملة!",
        "قريبًا ستحصل على جملة مثيرة للترجمة، استعد!",
        "الترجمة تحتاج إلى تركيز، انتظر لرؤية الجملة وترجمها بدقة.",
        "التفكير العميق يحتاج للوقت، لننتظر سويًا للحصول على جملة لترجمتها.",
        "الترجمة فن يتطلب صبرًا، سنقدم لك جملة لتحدي ترجمتها.",
        "المتعة في تحديد المعاني، انتظر لرؤية الجملة وبدأ الترجمة."
    ];

    const getSentence = async (direction = isEnglishToArabic) => {
        setAssistantAnswer("");
        setValue("");
        setShowFooterButton(false);
        setLoading(true);
        setCheckDisabled(false);

        const currentPrompt = getPrompt(direction);
        const response = await getChatCompletion([currentPrompt]);

        checkResponse(response, "question", currentPrompt);
        setShowFooterButton(true);
        setTextButton('أعطني جملة جديدة');
        setLoading(false);
    };

    const checkResponse = (response, messageType, usedPrompt = null) => {
        if (response.status == 200) {
            if (messageType == "question") {
                setMessage(response.data.content);
            } else {
                setAssistantAnswer(response.data.content);
            };

            if (usedPrompt) {
                setContextPreviousMessage([
                    usedPrompt,
                    {
                        role: response.data.role,
                        content: response.data.content
                    }
                ]);
            }
        } else {
            setShowAlert(true);
            setErrorMessage(response.data.error);
        };
    };

    const getNewSentence = async () => {
        setAssistantAnswer("");
        setValue("");
        setShowFooterButton(false);
        setLoading(true);

        const newSentencePrompt = isEnglishToArabic 
            ? `Give me a DIFFERENT simple English sentence about "${slug}" for A2 level students. Make sure it's different from the previous sentences. Only provide the English sentence, nothing else.`
            : `أعطني جملة عربية بسيطة مختلفة عن "${slug}" لطلاب مستوى A2. تأكد أنها مختلفة عن الجمل السابقة. قدم الجملة العربية فقط.`;

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: newSentencePrompt
            }
        ]);

        checkResponse(response, "question");
        setShowFooterButton(true);
        setLoading(false);
    };

    const checkAnswer = async () => {
        setTranslateLoading(true);

        const evaluationPrompt = isEnglishToArabic
            ? `As an English teacher, please evaluate this translation:

            English sentence: "${message}"
            Student's Arabic translation: "${value}"

            Provide your feedback in Arabic following this structure:
            1. Is the translation correct? (صحيحة/غير صحيحة)
            2. If correct: Praise the student briefly
            3. If incorrect: 
            - Explain what's wrong in simple terms
            - Provide the correct translation
            - Give a helpful tip to improve

            Keep your response concise and encouraging for an A2 level student.`
            : `As an English teacher, please evaluate this translation:

            Arabic sentence: "${message}"
            Student's English translation: "${value}"

            Provide your feedback in Arabic following this structure:
            1. Is the translation correct? (صحيحة/غير صحيحة)
            2. If correct: Praise the student briefly
            3. If incorrect: 
            - Explain what's wrong in simple terms
            - Provide the correct translation
            - Give a helpful tip to improve

            Keep your response concise and encouraging for an A2 level student.`;

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: evaluationPrompt
            }
        ]);

        checkResponse(response, "answer");
        setValue("");
        setTranslateLoading(false);
        setCheckDisabled(true);
    };

    // عكس اتجاه الترجمة
    const toggleDirection = () => {
        const newDirection = !isEnglishToArabic;
        setIsEnglishToArabic(newDirection);
        getSentence(newDirection);
    };

    useEffect(() => {
        // تنفيذ مرة واحدة فقط لتجنب double mount في Strict Mode
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            clearMessages();
            getSentence(true); // الوضع الافتراضي: إنجليزي → عربي
        };

        // تفريغ المحادثة عند مغادرة الصفحة
        return () => {
            clearMessages();
        };
    }, []);

    return (
        <MainLayout loading={loading} onButtonClick={() => getNewSentence()} loadingText={loadingTextArray[Math.floor(Math.random() * (loadingTextArray.length - 1))]}>
            {message && (
                <CardContent sx={{ mb: 12, textAlign: 'center' }}>
                    {/* زر عكس اتجاه الترجمة */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                        <Typography sx={{ mx: 1, fontWeight: 'bold', color: '#1976d2' }}>
                            {isEnglishToArabic ? 'English' : 'عربي'}
                        </Typography>
                        <Tooltip title="عكس اتجاه الترجمة">
                            <IconButton 
                                onClick={toggleDirection}
                                sx={{ 
                                    backgroundColor: '#e3f2fd',
                                    '&:hover': { backgroundColor: '#bbdefb' }
                                }}
                            >
                                <SwapHorizIcon sx={{ color: '#1976d2' }} />
                            </IconButton>
                        </Tooltip>
                        <Typography sx={{ mx: 1, fontWeight: 'bold', color: '#757575' }}>
                            {isEnglishToArabic ? 'عربي' : 'English'}
                        </Typography>
                    </Box>

                    <Typography component="p">
                        {isEnglishToArabic ? 'ترجم هذه الجملة إلى اللغة العربية:' : 'ترجم هذه الجملة إلى اللغة الإنجليزية:'}
                    </Typography>
                    <Box sx={{ 
                        mt: 4, 
                        p: 2, 
                        borderRadius: 2, 
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography sx={{ 
                            fontSize: '18px', 
                            textAlign: 'center', 
                            direction: isEnglishToArabic ? 'ltr' : 'rtl' 
                        }} component="p">
                            {message}
                        </Typography>
                    </Box>
                    <Box component="div" sx={{ mt: 4 }}>
                        <TextField 
                            placeholder={isEnglishToArabic ? "الترجمة بالعربية" : "Translation in English"}
                            fullWidth
                            multiline
                            rows={2}
                            value={value} 
                            onChange={e => setValue(e.target.value)}
                            sx={{ direction: isEnglishToArabic ? 'ltr' : 'rtl' }}
                        />
                        <Button 
                            variant="contained" 
                            sx={{ display: 'block', mt: 2, mx: 'auto' }} 
                            onClick={() => checkAnswer()}
                            disabled={!value.trim() || translateLoading || checkDisabled}
                        >
                            تأكد من الترجمة
                        </Button>
                    </Box>
                    {(translateLoading || assistantAnswer) && (
                        <Box sx={{ 
                            mt: 3, 
                            p: 2, 
                            borderRadius: 2, 
                            backgroundColor: '#e8f5e9',
                            border: '1px solid #c8e6c9'
                        }}>
                            {translateLoading ? (
                                <CircularProgress size={30} />
                            ) : (
                                <Typography sx={{ fontSize: '16px', lineHeight: 1.8 }} component="div">
                                    {assistantAnswer.split(/\n/).map((line, i) => <p key={i} style={{ margin: '8px 0' }}>{line}</p>)}
                                </Typography>
                            )}
                        </Box>
                    )}
                </CardContent>
            )}
        </MainLayout>
    );
};