'use client';

import { useState, useEffect, useRef, use } from 'react';
import {
  Box,
  Button,
  CardContent,
  CircularProgress,
  IconButton,
  Typography,
  Paper,
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import dynamic from 'next/dynamic';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion, getTextCompletion, getTranscription } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import type {
  SlugPageParams,
  ChatMessage,
  ApiResponse,
  ChatCompletionData,
  TextCompletionData,
  TranscriptionData,
} from '@/app/types';

// تحميل ReactMediaRecorder فقط على جانب العميل
const ReactMediaRecorder = dynamic(
  () => import('react-media-recorder').then((mod) => mod.ReactMediaRecorder),
  { ssr: false }
);

export default function ConversationPage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sentence, setSentence] = useState('');
  const [assistantAnswer, setAssistantAnswer] = useState('');
  const [transcriptionLoading, setTranscriptionLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const hasInitialized = useRef(false);
  const clearBlobUrlRef = useRef<(() => void) | null>(null);

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
    clearMessages,
  } = useAppContext();

  const prompt: ChatMessage = {
    role: 'user',
    content: `As an English pronunciation coach for A2 level students, provide ONE simple English sentence that uses "${slug}".

        Requirements:
        - Use clear, commonly spoken words (5-10 words)
        - Choose words that are easy to pronounce for beginners
        - Make the sentence practical for everyday conversation
        - Only provide the English sentence, nothing else

        Example: "I like to read books every day."`,
  };

  const checkResponse = (
    response:
      | ApiResponse<ChatCompletionData>
      | ApiResponse<TextCompletionData>
      | ApiResponse<TranscriptionData>,
    messageType: 'question' | 'answer'
  ) => {
    if (response.status === 200) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data = response.data as any;
      if (messageType === 'question') {
        const content = (data.content as string) || '';
        setMessage(content);
        setContextPreviousMessage([
          prompt,
          {
            role: (data.role || 'assistant') as ChatMessage['role'],
            content,
          },
        ]);
      } else {
        const responseText = (data.text as string) || (data.content as string) || String(data);
        setAssistantAnswer(responseText);
      }
    } else {
      setShowAlert(true);
      setErrorMessage('حدث خطأ');
    }
  };

  const getSentence = async () => {
    if (clearBlobUrlRef.current) clearBlobUrlRef.current();
    setAssistantAnswer('');
    setShowFooterButton(false);
    setLoading(true);

    const response = await getChatCompletion([prompt]);
    checkResponse(response, 'question');
    setShowFooterButton(true);
    setTextButton('أعطني جملة جديدة');
    setLoading(false);
  };

  const getNewSentence = async () => {
    if (clearBlobUrlRef.current) clearBlobUrlRef.current();
    setAssistantAnswer('');
    setSentence('');
    setShowFooterButton(false);
    setLoading(true);

    const response = await getChatCompletion([
      ...contextPreviousMessage,
      {
        role: 'user',
        content: `Give me a DIFFERENT simple English sentence about "${slug}" for pronunciation practice. Make it different from the previous ones. Only provide the sentence.`,
      },
    ]);

    checkResponse(response, 'question');
    setShowFooterButton(true);
    setLoading(false);
  };

  const getConfirmSentence = async (confirmSentence: string) => {
    const response = await getTextCompletion(
      `You are an English pronunciation evaluator for A2 level Arabic-speaking students.

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

        Your feedback:`
    );

    checkResponse(response, 'answer');
    setTranscriptionLoading(false);
  };

  const fetchText = async (blobUrl: string) => {
    try {
      const response = await getTranscription(blobUrl);
      setTranscriptionLoading(true);
      setSentence(response.data.text);
      getConfirmSentence(response.data.text);
    } catch (error) {
      console.error(error);
      setTranscriptionLoading(false);
    }
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      clearMessages();
      getSentence();
    }
    return () => {
      clearMessages();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout
      loading={loading}
      onButtonClick={getNewSentence}
      loadingText={getRandomLoadingText('conversation')}
    >
      {message && (
        <CardContent sx={{ mb: 14, textAlign: 'center' }}>
          <Typography component="p" sx={{ color: 'text.secondary' }}>
            حاول قراءة هذه الجملة:
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
                direction: 'ltr',
                fontWeight: 500,
              }}
              component="p"
            >
              {message}
            </Typography>
          </Paper>

          {/* Media Recorder */}
          {isClient && ReactMediaRecorder && (
            <ReactMediaRecorder
              audio
              render={({ status, startRecording, stopRecording, mediaBlobUrl, clearBlobUrl }) => {
                clearBlobUrlRef.current = clearBlobUrl;

                return (
                  <>
                    <Box sx={{ mt: 4 }}>
                      {status === 'recording' ? (
                        <IconButton
                          onClick={stopRecording}
                          sx={{
                            backgroundColor: 'error.light',
                            '&:hover': {
                              backgroundColor: 'error.main',
                            },
                            p: 2,
                          }}
                        >
                          <StopCircleIcon sx={{ fontSize: 40, color: 'error.dark' }} />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={startRecording}
                          sx={{
                            backgroundColor: 'primary.light',
                            '&:hover': {
                              backgroundColor: 'primary.main',
                              '& svg': { color: 'white' },
                            },
                            p: 2,
                          }}
                        >
                          <MicIcon sx={{ fontSize: 40, color: 'primary.dark' }} />
                        </IconButton>
                      )}
                      <Typography
                        sx={{
                          mt: 1,
                          fontSize: '13px',
                          color: 'text.secondary',
                        }}
                      >
                        {status === 'recording'
                          ? 'جاري التسجيل... اضغط للإيقاف'
                          : 'اضغط لبدء التسجيل'}
                      </Typography>
                    </Box>

                    {mediaBlobUrl && (
                      <Box sx={{ mt: 4 }}>
                        <audio src={mediaBlobUrl} controls style={{ borderRadius: '8px' }} />
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            onClick={() => fetchText(mediaBlobUrl)}
                            disabled={transcriptionLoading}
                          >
                            {transcriptionLoading ? (
                              <CircularProgress size={20} sx={{ color: 'white' }} />
                            ) : (
                              'تأكد من الجملة'
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
            <Paper
              elevation={0}
              sx={{
                mt: 4,
                p: 2.5,
                borderRadius: 2,
                backgroundColor: 'success.light',
                border: 1,
                borderColor: 'success.main',
              }}
            >
              <Typography sx={{ fontSize: '16px', lineHeight: 1.8, mb: 2 }} component="p">
                {assistantAnswer}
              </Typography>
              {sentence && (
                <Box
                  sx={{
                    mt: 2,
                    pt: 2,
                    borderTop: 1,
                    borderColor: 'success.main',
                  }}
                >
                  <Typography sx={{ fontSize: '13px', color: 'text.secondary' }} component="p">
                    الجملة التي ذكرتها:
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      direction: 'ltr',
                      textAlign: 'center',
                      mt: 1,
                      fontWeight: 500,
                    }}
                    component="p"
                  >
                    &quot;{sentence}&quot;
                  </Typography>
                </Box>
              )}
            </Paper>
          )}
        </CardContent>
      )}
    </MainLayout>
  );
}
