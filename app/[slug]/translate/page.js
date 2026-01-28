"use client"

import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion } from "@/app/controllers/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import { Box, Button, CardContent, CircularProgress, TextField, Typography } from "@mui/material";
import { use, useContext, useEffect, useRef, useState } from "react";


export default function Page({ params }) {
    const { slug } = use(params);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState("");
    const [assistantAnswer, setAssistantAnswer] = useState("");
    const [translateLoading, setTranslateLoading] = useState(false);
    const hasInitialized = useRef(false);

    const { 
        setContextPreviousMessage, 
        contextPreviousMessage, 
        setErrorMessage, 
        setShowAlert, 
        setTextButton, 
        setShowFooterButton,
        clearMessages 
    } = useContext(AppContext);

    const prompt = {
        role: "user",
        content: `As an English teacher for A2 level students, create ONE simple English sentence that demonstrates the use of "${slug}".

        Requirements:
        - Use clear, common vocabulary appropriate for A2 level
        - The sentence should be between 5-12 words
        - Make it practical and relatable to everyday life
        - Only provide the English sentence, nothing else
        - Do not include translation or explanation

        Example format: "I went to the market yesterday."`
    };

    const loadingTextArray = [
        "الصبر مفتاح الإتقان، انتظر قليلاً وستحصل على جملة لترجمتها.",
        "استمتع بلحظات الانتظار بتحديد معنى هذه الجملة!",
        "قريبًا ستحصل على جملة مثيرة للترجمة، استعد!",
        "الترجمة تحتاج إلى تركيز، انتظر لرؤية الجملة وترجمها بدقة.",
        "التفكير العميق يحتاج للوقت، لننتظر سويًا للحصول على جملة لترجمتها.",
        "الترجمة فن يتطلب صبرًا، سنقدم لك جملة لتحدي ترجمتها.",
        "المتعة في تحديد المعاني، انتظر لرؤية الجملة وبدأ الترجمة."
    ];

    const getSentence = async () => {
        setAssistantAnswer("");
        setShowFooterButton(false);
        setLoading(true);

        const response = await getChatCompletion([prompt]);

        checkResponse(response, "question");
        setShowFooterButton(true);
        setTextButton('أعطني جملة جديدة');
        setLoading(false);
    };

    const checkResponse = (response, messageType) => {
        if (response.status == 200) {
            if (messageType == "question") {
                setMessage(response.data.content);
            } else {
                setAssistantAnswer(response.data.content);
            };

            setContextPreviousMessage([
                prompt,
                {
                    role: response.data.role,
                    content: response.data.content
                }
            ]);
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

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: `Give me a DIFFERENT simple English sentence about "${slug}" for A2 level students. Make sure it's different from the previous sentences. Only provide the English sentence, nothing else.`
            }
        ]);

        checkResponse(response, "question");
        setShowFooterButton(true);
        setLoading(false);
    };

    const checkAnswer = async () => {
        setTranslateLoading(true);

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: `As an English teacher, please evaluate this translation:

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
            }
        ]);

        checkResponse(response, "answer");
        setValue("");
        setTranslateLoading(false);
    };

    useEffect(() => {
        // تنفيذ مرة واحدة فقط لتجنب double mount في Strict Mode
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            clearMessages();
            getSentence();
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
                    <Typography component="p">ترجم هذه الجملة إلى اللغة العربية:</Typography>
                    <Box sx={{ 
                        mt: 4, 
                        p: 2, 
                        borderRadius: 2, 
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #e0e0e0'
                    }}>
                        <Typography sx={{ fontSize: '18px', textAlign: 'center', direction: 'ltr' }} component="p">
                            {message}
                        </Typography>
                    </Box>
                    <Box component="div" sx={{ mt: 4 }}>
                        <TextField 
                            placeholder="الترجمة" 
                            fullWidth
                            multiline
                            rows={2}
                            value={value} 
                            onChange={e => setValue(e.target.value)} 
                        />
                        <Button 
                            variant="contained" 
                            sx={{ display: 'block', mt: 2, mx: 'auto' }} 
                            onClick={() => checkAnswer()}
                            disabled={!value.trim()}
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