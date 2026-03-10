'use client';

import { useState, useEffect, useRef, use } from 'react';
import { CardContent, Typography, Box, Paper, useTheme } from '@mui/material';
import MainLayout from '@/app/layouts/MainLayout';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText } from '@/app/config';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import { CONTENT_BOTTOM_MARGIN, lecturePaperSx, sectionColors, fontSize } from '@/app/styles';
import type { SlugPageParams } from '@/app/types';

export default function LecturePage({ params }: SlugPageParams) {
  const { slug } = use(params);
  const theme = useTheme();
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
        <CardContent sx={{ mb: CONTENT_BOTTOM_MARGIN }}>
          {messages
            .filter((msg) => msg.role === 'assistant')
            .slice(-1)
            .map((msg, index) => (
              <Paper key={index} elevation={0} sx={lecturePaperSx(theme.palette.mode)}>
                <Typography
                  sx={{
                    fontSize: fontSize.body,
                    lineHeight: 1.8,
                    color: sectionColors.lecture.text(theme.palette.mode),
                  }}
                  component="div"
                >
                  <MarkdownRenderer
                    content={msg.content}
                    color={sectionColors.lecture.text(theme.palette.mode)}
                  />
                </Typography>
              </Paper>
            ))}
        </CardContent>
      )}
    </MainLayout>
  );
}
