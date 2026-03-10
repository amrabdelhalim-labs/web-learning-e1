'use client';

import { useState, useEffect, use } from 'react';
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import {
  CONTENT_BOTTOM_MARGIN,
  questionPaperSx,
  answerPaperSx,
  sectionColors,
  fontSize,
} from '@/app/styles';
import type { SlugPageParams, ChatMessage } from '@/app/types';

export default function QuestionPage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [answersArray, setAnswersArray] = useState<string[]>([]);
  const [question, setQuestion] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [answerLoading, setAnswerLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [answersDisabled, setAnswersDisabled] = useState(false);

  const prompt: ChatMessage = {
    role: 'user',
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
        D) goed`,
  };

  const {
    setShowFooterButton,
    setTextButton,
    setContextPreviousMessage,
    contextPreviousMessage,
    clearMessages,
    setShowAlert,
    setErrorMessage,
  } = useAppContext();

  const questionRegex = (text: string) => {
    const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);

    const questionLine = lines.find((line) => !/^\s*[A-D]\s*\)/.test(line)) || lines[0];

    const answers = lines.filter((line) => /^\s*[A-D]\s*\)/.test(line)).map((ans) => ans.trim());

    if (answers.length === 0) {
      const singleLineRegex = /([A-D]\)\s*[^A-D]+?)(?=[A-D]\)|$)/g;
      const matches = text.matchAll(singleLineRegex);
      for (const match of matches) {
        answers.push(match[0].trim());
      }
    }

    setQuestion(questionLine.trim());
    setAnswersArray(answers.length > 0 ? answers : []);
    setMessage(text);
  };

  const checkResponse = (
    response: { data: { role?: string; content?: string; error?: string }; status: number },
    messageType: 'question' | 'answer'
  ) => {
    if (response.status === 200) {
      if (messageType === 'question') {
        questionRegex(response.data.content || '');
        setContextPreviousMessage([
          prompt,
          {
            role: (response.data.role || 'assistant') as ChatMessage['role'],
            content: response.data.content || '',
          },
        ]);
      } else {
        setAssistantAnswer(response.data.content || '');
        setContextPreviousMessage([
          ...contextPreviousMessage,
          { role: 'user', content: userAnswer },
          {
            role: (response.data.role || 'assistant') as ChatMessage['role'],
            content: response.data.content || '',
          },
        ]);
      }
    } else {
      setShowAlert(true);
      setErrorMessage(response.data.error || 'حدث خطأ');
    }
  };

  const getQuestion = async () => {
    setAssistantAnswer('');
    setAnswersDisabled(false);
    setShowFooterButton(false);
    setLoading(true);

    const response = await getChatCompletion([prompt]);

    checkResponse(response, 'question');
    setShowFooterButton(true);
    setTextButton('أعطني سؤال جديد');
    setLoading(false);
  };

  const checkAnswer = async (answer: string) => {
    setAnswerLoading(true);
    setAnswersDisabled(true);

    const response = await getChatCompletion([
      { role: 'assistant', content: message },
      {
        role: 'user',
        content: `هل الإجابة ${answer} صحيحة للسؤال التالي: ${message}`,
      },
    ]);

    checkResponse(response, 'answer');
    setAnswerLoading(false);
  };

  const getNewQuestion = async () => {
    setAssistantAnswer('');
    setAnswersDisabled(false);
    setLoading(true);

    const response = await getChatCompletion([
      ...contextPreviousMessage,
      {
        role: 'user',
        content: `give me one more question about ${slug} without answer`,
      },
    ]);

    checkResponse(response, 'question');
    setLoading(false);
  };

  useEffect(() => {
    clearMessages();
    getQuestion();
    return () => {
      clearMessages();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout
      loading={loading}
      onButtonClick={getNewQuestion}
      loadingText={getRandomLoadingText('question')}
    >
      {question && (
        <CardContent sx={{ textAlign: 'center', mb: CONTENT_BOTTOM_MARGIN }}>
          <Paper
            elevation={0}
            sx={{
              ...questionPaperSx(theme.palette.mode),
              mb: 3,
            }}
          >
            <Typography
              component="h3"
              sx={{
                direction: 'ltr',
                fontSize: fontSize.body,
                fontWeight: 600,
                color: sectionColors.question.text(theme.palette.mode),
              }}
            >
              {question}
            </Typography>
          </Paper>

          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, justifyContent: 'center' }}>
            {answersArray.map((item, index) => (
              <Button
                variant="outlined"
                size="medium"
                key={index}
                disabled={answersDisabled || answerLoading}
                onClick={() => {
                  setUserAnswer(item);
                  checkAnswer(item);
                }}
                sx={{
                  direction: 'ltr',
                  textTransform: 'none',
                  minWidth: 120,
                }}
              >
                {item}
              </Button>
            ))}
          </Box>

          <Box sx={{ mt: 3 }}>
            {answerLoading ? (
              <CircularProgress size={32} />
            ) : (
              assistantAnswer && (
                <Paper
                  elevation={0}
                  sx={{
                    ...answerPaperSx(theme.palette.mode),
                    p: 2,
                  }}
                >
                  <Typography
                    component="span"
                    sx={{
                      fontSize: fontSize.secondary,
                      color: sectionColors.answer.text(theme.palette.mode),
                      fontWeight: 500,
                    }}
                  >
                    <MarkdownRenderer
                      content={assistantAnswer}
                      color={sectionColors.answer.text(theme.palette.mode)}
                    />
                  </Typography>
                </Paper>
              )
            )}
          </Box>
        </CardContent>
      )}
    </MainLayout>
  );
}
