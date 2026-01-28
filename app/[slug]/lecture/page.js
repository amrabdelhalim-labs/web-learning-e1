"use client"

import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion } from "@/app/controllers/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import { CardContent, Typography, Box } from "@mui/material";
import { use, useContext, useEffect, useRef, useState } from "react";


export default function Page({ params }) {
    const { slug } = use(params);
    const [loading, setLoading] = useState(false);
    const hasInitialized = useRef(false);

    const {
        contextPreviousMessage,
        messages,
        handleChatResponse,
        clearMessages,
        setTextButton,
        setShowFooterButton
    } = useContext(AppContext);

    const prompt = {
        role: "user",
        content: `أشرح لي كطالب يتعلم اللغة الإنجليزية في مستوى A2 ماهو ${slug}`
    };

    const loadingTextArray = [
        "نحضر لك درسًا شيقًا",
        "قريبًا ستبدأ الدرس الممتع، استعد!",
        "درس شيق قيد الإعداد، يرجى الانتظار.",
        "جارٍ تحضير درس مثير، قليلًا من الصبر.",
        "استعد لدرس مميز، سيبدأ قريبًا.",
        "درس شيق قادم، استعد للاستفادة.",
        "نحن في طور إعداد درس مثير، انتظر لحظة."
    ];


    const getLecture = async () => {
        setShowFooterButton(false);
        setLoading(true);

        const response = await getChatCompletion([prompt]);

        handleChatResponse(response, prompt.content);
        setShowFooterButton(true);
        setTextButton('أشرح لي المزيد');
        setLoading(false);
    };

    const getMoreData = async () => {
        setShowFooterButton(false);
        setLoading(true);

        const morePrompt = `أشرح لي المزيد عن ${slug}`;

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: morePrompt
            }
        ]);

        handleChatResponse(response, morePrompt);
        setShowFooterButton(true);
        setLoading(false);
    };

    useEffect(() => {
        // تنفيذ getLecture مرة واحدة فقط عند الدخول لتجنب double mount في Strict Mode
        if (!hasInitialized.current) {
            hasInitialized.current = true;
            clearMessages();
            getLecture();
        };

        // تفريغ المحادثة عند مغادرة الصفحة
        return () => {
            clearMessages();
        };
    }, []);

    return (
        <MainLayout loading={loading} onButtonClick={() => getMoreData()} loadingText={loadingTextArray[Math.floor(Math.random() * (loadingTextArray.length - 1))]}>
            {messages.length > 0 && (
                <CardContent sx={{ mb: 12 }}>
                    {/* عرض آخر رد من المساعد فقط */}
                    {messages.filter(msg => msg.role === 'assistant').slice(-1).map((msg, index) => (
                        <Box key={index} sx={{ 
                            p: 2, 
                            borderRadius: 2, 
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #e0e0e0'
                        }}>
                            <Typography sx={{ fontSize: '16px', lineHeight: 1.8 }} variant="p" component="div">
                                {msg.content.split(/\n/).map((line, i) => <p key={i} style={{ margin: '8px 0' }}>{line}</p>)}
                            </Typography>
                        </Box>
                    ))}
                </CardContent>
            )}
        </MainLayout>
    );
};