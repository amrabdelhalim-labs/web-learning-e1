'use client';

import { useState, useEffect, useRef, use } from 'react';
import { CardContent, Typography, Box, Paper } from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import type { SlugPageParams } from '@/app/types';

export default function LecturePage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const [loading, setLoading] = useState(false);
  const hasInitialized = useRef(false);

  const {
    contextPreviousMessage,
    messages,
    handleChatResponse,
    clearMessages,
    setTextButton,
    setShowFooterButton,
  } = useAppContext();

  const prompt = {
    role: 'user' as const,
    content: `أشرح لي كطالب يتعلم اللغة الإنجليزية في مستوى A2 ماهو ${slug}`,
  };

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
      { role: 'user', content: morePrompt },
    ]);

    handleChatResponse(response, morePrompt);
    setShowFooterButton(true);
    setLoading(false);
  };

  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      clearMessages();
      getLecture();
    }
    return () => {
      clearMessages();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout
      loading={loading}
      onButtonClick={getMoreData}
      loadingText={getRandomLoadingText('lecture')}
    >
      {messages.length > 0 && (
        <CardContent sx={{ mb: 14 }}>
          {messages
            .filter((msg) => msg.role === 'assistant')
            .slice(-1)
            .map((msg, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 2.5,
                  borderRadius: 2,
                  backgroundColor: 'action.hover',
                  border: 1,
                  borderColor: 'divider',
                }}
              >
                <Typography sx={{ fontSize: '16px', lineHeight: 1.8 }} component="div">
                  {msg.content.split(/\n/).map((line, i) => (
                    <Box key={i} component="p" sx={{ my: 1 }}>
                      {line}
                    </Box>
                  ))}
                </Typography>
              </Paper>
            ))}
        </CardContent>
      )}
    </MainLayout>
  );
}
