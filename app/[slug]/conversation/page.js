"use client"

import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion, getTextCompletion, getTranscription } from "@/app/controllers/dataFetch";
import MainLayout from "@/app/layouts/MainLayout";
import { Box, Button, CardContent, CircularProgress, IconButton, Typography } from "@mui/material";
import { use, useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';

// تحميل ReactMediaRecorder فقط على جانب العميل
const ReactMediaRecorder = dynamic(
    () => import('react-media-recorder').then(mod => mod.ReactMediaRecorder),
    { ssr: false }
);

export default function Page({ params }) {
    const { slug } = use(params);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sentence, setSentence] = useState("");
    const [assistantAnswer, setAssistantAnswer] = useState("");
    const [transcriptionLoading, setTranscriptionLoading] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const hasInitialized = useRef(false);
    const clearBlobUrlRef = useRef(null);

    // التأكد من أننا على جانب العميل
    useEffect(() => {
        setIsClient(true);
    }, []);

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
        content: `As an English pronunciation coach for A2 level students, provide ONE simple English sentence that uses "${slug}".

        Requirements:
        - Use clear, commonly spoken words (5-10 words)
        - Choose words that are easy to pronounce for beginners
        - Make the sentence practical for everyday conversation
        - Only provide the English sentence, nothing else

        Example: "I like to read books every day."`
    };

    const loadingTextArray = [
        "القراءة توسّع مفرداتك وتعزز قوة لغتك.",
        "كل جملة تعزز فهمك لبنية اللغة واستخدام الكلمات.",
        "من خلال القراءة، تصبح أكثر دقة في التعبير عن أفكارك.",
        "اكتشف معاني جديدة واستخدمها لتحسين تواصلك اللغوي.",
        "قراءة الجمل تساعدك في تطوير مهاراتك في القواعد اللغوية.",
        "استمتع بالتعرف على أساليب متنوعة للتعبير من خلال القراءة.",
        "كل جملة تمنحك نموًا في فهمك للغة واستخدامها بثقة."
    ];


    const getSentence = async () => {
        if (clearBlobUrlRef.current) clearBlobUrlRef.current();

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
                setContextPreviousMessage([
                    prompt,
                    {
                        role: response.data.role,
                        content: response.data.content
                    }
                ]);
            } else {
                // استخراج النص من response - قد يكون text أو content أو string مباشر
                const responseText = response.data?.text || response.data?.content || response.data;
                setAssistantAnswer(typeof responseText === 'string' ? responseText : String(responseText));
            };
        } else {
            setShowAlert(true);
            setErrorMessage(response.data.error);
        };
    };

    const getNewSentence = async () => {
        if (clearBlobUrlRef.current) clearBlobUrlRef.current();

        setAssistantAnswer("");
        setSentence("");
        setShowFooterButton(false);
        setLoading(true);

        const response = await getChatCompletion([
            ...contextPreviousMessage,
            {
                role: "user",
                content: `Give me a DIFFERENT simple English sentence about "${slug}" for pronunciation practice. Make it different from the previous ones. Only provide the sentence.`
            }
        ]);

        checkResponse(response, "question");
        setShowFooterButton(true);
        setLoading(false);
    };

    const fetchText = async (blobUrl) => {
        try {
            const response = await getTranscription(blobUrl);

            setTranscriptionLoading(true);
            setSentence(response.data.text);
            getConfirmSentence(response.data.text);
        } catch (error) {
            console.error(error);
            setTranscriptionLoading(false);
        };
    };


    const getConfirmSentence = async (confirmSentence) => {
        const response = await getTextCompletion(`You are an English pronunciation evaluator for A2 level Arabic-speaking students.

        Compare the student's spoken sentence with the correct sentence and provide feedback IN ARABIC.

        Correct sentence: "${message}"
        Student said: "${confirmSentence}"

        Rules for evaluation:
        1. If sentences match perfectly (or nearly perfect with minor variations): Praise the student enthusiastically
        2. If there are pronunciation errors: 
        - Identify which specific words were mispronounced
        - Explain the correct pronunciation simply
        - Be encouraging and supportive

        Respond ONLY in Arabic. Keep your response brief (2-3 sentences max).

        Your feedback:`);

        checkResponse(response, "answer");
        setTranscriptionLoading(false);
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
                    <Typography component="p">حاول قراءة هذه الجملة:</Typography>
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
                    
                    {/* Media Recorder - يتم تحميله فقط على العميل */}
                    {isClient && ReactMediaRecorder && (
                        <ReactMediaRecorder
                            audio
                            render={({ status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
                                // حفظ clearBlobUrl للاستخدام في الدوال الأخرى
                                clearBlobUrlRef.current = clearBlobUrl;
                                
                                return (
                                    <>
                                        <Box component="div" sx={{ mt: 4 }}>
                                            {status === "recording" ? (
                                                <IconButton
                                                    onClick={stopRecording}
                                                    sx={{
                                                        backgroundColor: '#ffebee',
                                                        '&:hover': { backgroundColor: '#ffcdd2' },
                                                        p: 2
                                                    }}
                                                >
                                                    <StopCircleIcon sx={{ fontSize: 40, color: '#d32f2f' }} />
                                                </IconButton>
                                            ) : (
                                                <IconButton
                                                    onClick={startRecording}
                                                    sx={{
                                                        backgroundColor: '#e3f2fd',
                                                        '&:hover': { backgroundColor: '#bbdefb' },
                                                        p: 2
                                                    }}
                                                >
                                                    <MicIcon sx={{ fontSize: 40, color: '#1976d2' }} />
                                                </IconButton>
                                            )}
                                            <Typography sx={{ mt: 1, fontSize: '14px', color: '#757575' }}>
                                                {status === "recording" ? "جاري التسجيل... اضغط للإيقاف" : "اضغط لبدء التسجيل"}
                                            </Typography>
                                        </Box>
                                        {mediaBlobUrl && (
                                            <Box component="div" sx={{ mt: 4 }}>
                                                <audio src={mediaBlobUrl} controls style={{ borderRadius: '8px' }} />
                                                <Box component="div" sx={{ mt: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        onClick={() => fetchText(mediaBlobUrl)}
                                                        disabled={transcriptionLoading}
                                                    >
                                                        {transcriptionLoading ? (
                                                            <CircularProgress size={20} sx={{ color: 'white' }} />
                                                        ) : (
                                                            "تأكد من الجملة"
                                                        )}
                                                    </Button>
                                                </Box>
                                            </Box>
                                        )}
                                    </>
                                );
                            }}
                        />
                    )}
                    
                    {assistantAnswer && (
                        <Box sx={{
                            mt: 4,
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: '#e8f5e9',
                            border: '1px solid #c8e6c9'
                        }}>
                            <Typography sx={{ fontSize: '16px', lineHeight: 1.8, mb: 2 }} component="p">
                                {assistantAnswer}
                            </Typography>
                            {sentence && (
                                <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #c8e6c9' }}>
                                    <Typography sx={{ fontSize: '14px', color: '#757575' }} component="p">
                                        الجملة التي ذكرتها:
                                    </Typography>
                                    <Typography sx={{ fontSize: '16px', direction: 'ltr', textAlign: 'center', mt: 1 }} component="p">
                                        "{sentence}"
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    )}
                </CardContent>
            )}
        </MainLayout>
    );
};