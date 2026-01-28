"use client"

import MainLayout from "@/app/layouts/MainLayout";
import { use, useContext, useEffect, useState } from "react";
import { Box, Button, CardContent, CircularProgress, Typography } from "@mui/material";
import { AppContext } from "@/app/context/AppContext";
import { getChatCompletion } from "@/app/controllers/dataFetch";

export default function Page({ params }) {
    const { slug } = use(params);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [answersArray, setAnswersArray] = useState([]);
    const [question, setQuestion] = useState("");
    const [assistantAnswer, setAssistantAnswer] = useState("");
    const [answerLoading, setAnswerLoading] = useState(false);
    const [userAnswer, setUserAnswer] = useState("");
    const [answersDisabled, setAnswersDisabled] = useState(false);


    const prompt = {
        role: "user",
        content: `Give me one multiple-choice question about ${slug} for an A2 English learner.

        IMPORTANT FORMAT RULES:
        - Write the question text on line 1
        - Write choice A) on line 2
        - Write choice B) on line 3  
        - Write choice C) on line 4
        - Write choice D) on line 5
        - Each choice MUST be on a NEW LINE
        - Do NOT include the answer

        Example format:
        What is the past tense of "go"?
        A) goes
        B) going
        C) went
        D) goed`
    };

    const loadingTextArray = [
        "قريبًا سيتم كشف الستار عن السؤال الشيق، استعد للتحدي!",
        "هل أنت مستعد لإظهار مهاراتك؟ سنكشف عن السؤال قريبًا!",
        "التحدي قادم! انتظر لرؤية السؤال والتفوق في حله.",
        "استعد لاختبار قوتك العقلية، سنقدم لك السؤال قريبًا.",
        "نحن هنا لتقديم لك تحديًا جديدًا، استمتع بانتظار السؤال!",
        "استعد لرحلة تفكير مثيرة، سنعرض السؤال في وقت قريب.",
        "سنكشف النقاب عن اللغز قريبًا، حان وقت إثبات قوتك.",
        "انتظر لحظات قليلة، سنعرض السؤال وستبدأ المتعة!",
        "حان وقت اختبار قدراتك، استعد لحل السؤال."
    ];


    const {
        setShowFooterButton,
        setTextButton,
        setContextPreviousMessage,
        contextPreviousMessage,
        clearMessages,
        setShowAlert,
        setErrorMessage
    } = useContext(AppContext);

    const getQuestion = async () => {
        setAssistantAnswer("");
        setAnswersDisabled(false);
        setShowFooterButton(false);
        setLoading(true);

        const response = await getChatCompletion(
            [
                prompt
            ]
        );

        checkResponse(response, "question");
        setShowFooterButton(true);
        setTextButton("أعطني سؤال جديد");
        setLoading(false);
    };

    const questionRegex = (message) => {
        // تقسيم النص لأسطر
        const lines = message.split(/\r?\n/).filter(line => line.trim().length > 0);

        // استخراج السؤال (أول سطر لا يبدأ بـ A) أو B) أو C) أو D))
        const questionLine = lines.find(line => !/^\s*[A-D]\s*\)/.test(line)) || lines[0];

        // استخراج الإجابات - أي سطر يبدأ بـ A) أو B) أو C) أو D)
        const answers = lines.filter(line => /^\s*[A-D]\s*\)/.test(line)).map(ans => ans.trim());

        // إذا لم نجد إجابات في أسطر منفصلة، نحاول استخراجها من نفس السطر
        if (answers.length === 0) {
            // محاولة استخراج من سطر واحد مثل: "Question? A) ans B) ans C) ans D) ans"
            const singleLineRegex = /([A-D]\)\s*[^A-D]+?)(?=[A-D]\)|$)/g;
            const matches = message.matchAll(singleLineRegex);

            for (const match of matches) {
                answers.push(match[0].trim());
            };
        };

        setQuestion(questionLine.trim());
        setAnswersArray(answers.length > 0 ? answers : []);
        setMessage(message);
    };

    const checkResponse = (response, messageType) => {
        if (response.status == 200) {
            if (messageType == "question") {
                questionRegex(response.data.content);
                setContextPreviousMessage([
                    prompt,
                    {
                        role: response.data.role,
                        content: response.data.content
                    }
                ]);
            } else {
                setAssistantAnswer(response.data.content);
                setContextPreviousMessage([
                    ...contextPreviousMessage,
                    {
                        role: "user",
                        content: userAnswer
                    },
                    {
                        role: response.data.role,
                        content: response.data.content
                    }
                ]);
            };
        } else {
            setShowAlert(true);
            setErrorMessage(response.data.error);
        };
    };

    const checkAnswer = async (userAnswer) => {
        setAnswerLoading(true);
        setAnswersDisabled(true);

        const response = await getChatCompletion([
            {
                role: "assistant",
                content: message
            },
            {
                role: "user",
                content: `هل الإجابة ${userAnswer} صحيحة للسؤال التالي: ${message}`
            }
        ]);

        checkResponse(response, "answer");
        setAnswerLoading(false);
    };

    const getNewQuestion = async () => {
        setAssistantAnswer("");
        setAnswersDisabled(false);
        setLoading(true);

        const response = await getChatCompletion(
            [
                ...contextPreviousMessage,
                {
                    role: "user",
                    content: `give me one more question about ${slug} without answer`
                }
            ]
        );

        checkResponse(response, "question");
        setLoading(false);
    };

    useEffect(() => {
        clearMessages(); // تفريغ المحادثة السابقة عند دخول الصفحة
        getQuestion();

        // تفريغ المحادثة عند مغادرة الصفحة
        return () => {
            clearMessages();
        };
    }, []);

    return (
        <MainLayout loading={loading} onButtonClick={() => getNewQuestion()} loadingText={loadingTextArray[Math.floor(Math.random() * (loadingTextArray.length - 1))]}>
            {question &&
                <CardContent sx={{ textAlign: 'center', mb: 12 }}>
                    <Typography sx={{ direction: 'rtl' }} component="h3">
                        {question}
                    </Typography>
                    {
                        answersArray && answersArray.map((item, index) => {
                            return (
                                <Button 
                                    variant="contained" 
                                    size="medium"
                                    sx={{ ml: 2, mt: 2, direction: 'rtl' }}
                                    key={index}
                                    disabled={answersDisabled || answerLoading}
                                    onClick={() => { setUserAnswer(item); checkAnswer(item); }}
                                >
                                    {item}
                                </Button>
                            )
                        })
                    }
                    <Box component="div" sx={{ mt: 3 }}>
                        {answerLoading ? <CircularProgress /> :
                            assistantAnswer && <Typography component="span">
                                {assistantAnswer}
                            </Typography>
                        }
                    </Box>
                </CardContent>
            }
        </MainLayout>
    );
};