'use client';

import { useState, useEffect, useRef, use } from 'react';
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  useTheme,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import type { SlugPageParams, ChatMessage, ApiResponse, ChatCompletionData } from '@/app/types';

export default function TranslatePage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const theme = useTheme();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
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
    clearMessages,
  } = useAppContext();

  const getPrompt = (direction: boolean): ChatMessage => ({
    role: 'user',
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

        مثال: "ذهبت إلى السوق أمس."`,
  });

  const checkResponse = (
    response: ApiResponse<ChatCompletionData>,
    messageType: 'question' | 'answer',
    usedPrompt?: ChatMessage
  ) => {
    if (response.status === 200) {
      if (messageType === 'question') {
        setMessage(response.data.content || '');
      } else {
        setAssistantAnswer(response.data.content || '');
      }

      if (usedPrompt) {
        setContextPreviousMessage([
          usedPrompt,
          {
            role: response.data.role || 'assistant',
            content: response.data.content || '',
          },
        ]);
      }
    } else {
      setShowAlert(true);
      setErrorMessage('حدث خطأ');
    }
  };

  const getSentence = async (direction = isEnglishToArabic) => {
    setAssistantAnswer('');
    setValue('');
    setShowFooterButton(false);
    setLoading(true);
    setCheckDisabled(false);

    const currentPrompt = getPrompt(direction);
    const response = await getChatCompletion([currentPrompt]);

    checkResponse(response, 'question', currentPrompt);
    setShowFooterButton(true);
    setTextButton('أعطني جملة جديدة');
    setLoading(false);
  };

  const getNewSentence = async () => {
    setAssistantAnswer('');
    setValue('');
    setShowFooterButton(false);
    setLoading(true);

    const newSentencePrompt = isEnglishToArabic
      ? `Give me a DIFFERENT simple English sentence about "${slug}" for A2 level students. Make sure it's different from the previous sentences. Only provide the English sentence, nothing else.`
      : `أعطني جملة عربية بسيطة مختلفة عن "${slug}" لطلاب مستوى A2. تأكد أنها مختلفة عن الجمل السابقة. قدم الجملة العربية فقط.`;

    const response = await getChatCompletion([
      ...contextPreviousMessage,
      { role: 'user', content: newSentencePrompt },
    ]);

    checkResponse(response, 'question');
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
      { role: 'user', content: evaluationPrompt },
    ]);

    checkResponse(response, 'answer');
    setValue('');
    setTranslateLoading(false);
    setCheckDisabled(true);
  };

  const toggleDirection = () => {
    const newDirection = !isEnglishToArabic;
    setIsEnglishToArabic(newDirection);
    getSentence(newDirection);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      clearMessages();
      getSentence(true);
    }
    return () => {
      clearMessages();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout
      loading={loading}
      onButtonClick={getNewSentence}
      loadingText={getRandomLoadingText('translate')}
    >
      {message && (
        <CardContent sx={{ mb: 14, textAlign: 'center' }}>
          {/* زر عكس اتجاه الترجمة */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 3,
              gap: 1,
            }}
          >
            <Typography sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {isEnglishToArabic ? 'English' : 'عربي'}
            </Typography>
            <Tooltip title="عكس اتجاه الترجمة">
              <IconButton
                onClick={toggleDirection}
                color="primary"
                sx={{
                  backgroundColor: 'action.hover',
                  '&:hover': { backgroundColor: 'action.selected' },
                }}
              >
                <SwapHorizIcon />
              </IconButton>
            </Tooltip>
            <Typography sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
              {isEnglishToArabic ? 'عربي' : 'English'}
            </Typography>
          </Box>

          <Typography component="p" sx={{ color: 'text.secondary' }}>
            {isEnglishToArabic
              ? 'ترجم هذه الجملة إلى اللغة العربية:'
              : 'ترجم هذه الجملة إلى اللغة الإنجليزية:'}
          </Typography>

          <Paper
            elevation={0}
            sx={{
              mt: 3,
              p: 2.5,
              borderRadius: 2,
              backgroundColor: 'action.hover',
              border: 1,
              borderColor: 'divider',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                textAlign: 'center',
                direction: isEnglishToArabic ? 'ltr' : 'rtl',
                fontWeight: 500,
              }}
              component="p"
            >
              {message}
            </Typography>
          </Paper>

          <Box sx={{ mt: 4 }}>
            <TextField
              placeholder={isEnglishToArabic ? 'الترجمة بالعربية' : 'Translation in English'}
              fullWidth
              multiline
              rows={2}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              inputProps={{ dir: isEnglishToArabic ? 'rtl' : 'ltr' }}
              sx={{
                direction: isEnglishToArabic ? 'rtl' : 'ltr',
              }}
            />
            <Button
              variant="contained"
              sx={{ display: 'block', mt: 2, mx: 'auto' }}
              onClick={checkAnswer}
              disabled={!value.trim() || translateLoading || checkDisabled}
            >
              تأكد من الترجمة
            </Button>
          </Box>

          {(translateLoading || assistantAnswer) && (
            <Paper
              elevation={0}
              sx={{
                mt: 3,
                p: 2.5,
                borderRadius: 2,
                backgroundColor: theme.palette.mode === 'dark' ? '#1b5e20' : '#e8f5e9',
                border: 2,
                borderColor: '#2e7d32',
              }}
            >
              {translateLoading ? (
                <CircularProgress size={30} sx={{ color: '#2e7d32' }} />
              ) : (
                <Typography
                  sx={{
                    fontSize: '16px',
                    lineHeight: 1.8,
                    color: theme.palette.mode === 'dark' ? '#c8e6c9' : '#1b5e20',
                    fontWeight: 500,
                  }}
                  component="div"
                >
                  {assistantAnswer?.split(/\n/).map((line, i) => (
                    <Box key={i} component="p" sx={{ my: 1 }}>
                      {line}
                    </Box>
                  ))}
                </Typography>
              )}
            </Paper>
          )}
        </CardContent>
      )}
    </MainLayout>
  );
}
