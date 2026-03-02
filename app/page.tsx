'use client';

import { useState, useEffect, useCallback } from 'react';
import MainLayout from '@/app/layouts/MainLayout';
import {
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Paper,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TranslateIcon from '@mui/icons-material/Translate';
import { getChatCompletion } from '@/app/lib/api';
import { useAppContext } from '@/app/hooks/useAppContext';
import { getRandomLoadingText, APP_NAME } from '@/app/config';

const features = [
  { icon: <SchoolIcon color="primary" />, text: 'شرح للدرس بشكل كامل' },
  {
    icon: <QuizIcon color="primary" />,
    text: 'أسئلة عن نفس القواعد التي تدرسها',
  },
  {
    icon: <RecordVoiceOverIcon color="primary" />,
    text: 'قسم المحادثة وداخله ستأخذ جملة وتعمل على قولها وسيتأكد التطبيق من لفظك',
  },
  {
    icon: <TranslateIcon color="primary" />,
    text: 'قسم الترجمة والذي تترجم فيه جملة وتتأكد من ترجمتها',
  },
];

export default function HomePage() {
  const [loading, setLoading] = useState(false);

  const {
    messageValue,
    contextPreviousMessage,
    messages,
    handleChatResponse,
    clearMessages,
    setShowFooterButton,
  } = useAppContext();

  const getAnswer = useCallback(async () => {
    setShowFooterButton(false);
    setLoading(true);

    try {
      const response = await getChatCompletion([
        ...contextPreviousMessage,
        { role: 'user', content: messageValue },
      ]);

      handleChatResponse(response, messageValue);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [messageValue, contextPreviousMessage, handleChatResponse, setShowFooterButton]);

  useEffect(() => {
    if (messageValue) {
      getAnswer();
    } else {
      clearMessages();
    }
  }, [messageValue]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <MainLayout loading={loading} loadingText={getRandomLoadingText('home')}>
      {messages.length === 0 ? (
        <CardContent sx={{ mb: 14 }}>
          <Typography component="h1" sx={{ fontSize: '22px', fontWeight: 'bold', mb: 2 }}>
            تطبيق {APP_NAME} لتعليم اللغة الإنجليزية
          </Typography>
          <Typography component="p" sx={{ color: 'text.secondary', mb: 2 }}>
            من خلال هذا التطبيق تستطيع تعلم اللغة الإنجليزية من خلال أربع خطوات لكل قاعدة من قواعد
            اللغة الإنجليزية:
          </Typography>

          <List component="ul" sx={{ mb: 2 }}>
            {features.map((item, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ color: 'text.secondary' }}
                />
              </ListItem>
            ))}
          </List>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              mt: 2,
              borderRadius: 2,
              backgroundColor: 'action.hover',
            }}
          >
            <Typography component="p" sx={{ color: 'text.secondary', mb: 1 }}>
              يمكنك الوصول إلى هذه الأقسام من القائمة الجانبية على اليمين. أولاً اختر الدرس الذي
              تريده ومن ثم اضغط عليه، ستظهر قائمة صغيرة بأربع أقسام: شرح الدرس والأسئلة والمحادثة
              وأخيرًا الترجمة.
            </Typography>
            <Typography component="p" sx={{ color: 'text.secondary' }}>
              أيضًا في الأسفل لديك قسم &quot;اسألني&quot; وهذا القسم يمكنك من خلاله الحديث مع الذكاء
              الاصطناعي وسؤاله عن ما تريد أن يشرح لك أو يساعدك فيه.
            </Typography>
          </Paper>
        </CardContent>
      ) : (
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
                    <p key={i} style={{ margin: '8px 0' }}>
                      {line}
                    </p>
                  ))}
                </Typography>
              </Paper>
            ))}
        </CardContent>
      )}
    </MainLayout>
  );
}
