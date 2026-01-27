"use client";

import * as React from 'react';
import MainLayout from './layouts/MainLayout';
import { CardContent, Typography, List, ListItem, ListItemText, ListItemIcon, Box } from '@mui/material';
import PushPinIcon from "@mui/icons-material/PushPin"
import { getChatCompletion } from './controllers/dataFetch';
import { AppContext } from './context/AppContext';

export default function Home() {
  const [loading, setLoading] = React.useState(false);

  const {
    messageValue,
    contextPreviousMessage,
    messages,
    handleChatResponse,
    clearMessages,
    setShowFooterButton
  } = React.useContext(AppContext);

  const loadingTextArray = [
    "ستحصل على الإجابة في غضون لحظات قليلة.",
    "إجابتك ستكون متاحة لك في وقت قريب جدًا.",
    "ستتلقى الإجابة الخاصة بك في غضون لحظات.",
    "ستحصل على الإجابة في وقت قصير جدًا.",
    "ستكون لديك الإجابة في وقت قريب للغاية.",
    "إجابتك ستكون لديك خلال لحظات"
  ];


  const getAnswer = async () => {
    setShowFooterButton(false);
    setLoading(true);

    try {
      const response = await getChatCompletion(
        [
          ...contextPreviousMessage,
          {
            role: "user",
            content: messageValue
          }
        ]
      );

      handleChatResponse(response, messageValue);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    };
  };

  React.useEffect(() => {
    if (messageValue) {
      getAnswer();
    } else {
      clearMessages();
    };
  }, [messageValue]);

  // تفريغ المحادثة عند مغادرة الصفحة
  React.useEffect(() => {
    return () => {
      clearMessages();
    };
  }, []);


  return (
    <MainLayout loading={loading} loadingText={loadingTextArray[Math.floor(Math.random() * (loadingTextArray.length - 1))]}>
      {
        messages.length === 0 ?
          <CardContent sx={{ mb: 12 }}>
            <Typography component="h1" sx={{ fontSize: "20px", fontWeight: "bold", mb: 2 }}>تطبيق علمني لتعليم اللغة الإنجليزية</Typography>
            <Typography variant="p" component="p">من خلال هذا التطبيق تتسطيع تعلم اللغة الإنجليزية من خلال أربع خطوات لكل قاعدة من قواعد اللغة الإنجليزية، النقاط الأربعة هي:</Typography>
            <List component="ul">
              {['شرح للدرس بشكل كامل',
                'أسئلة عن نفس القواعد التي تدرسها',
                'قسم المحادثة وداخله ستأخذ جملة وتعمل على قولها وسيتأكد التطبيق من لفظك',
                'قسم الترجمة والذي تترجم فيه جملة وتتأكد من ترجمتها'
              ].map((item, index) => {
                return (
                  <ListItem key={index} >
                    <ListItemIcon sx={{ minWidth: '35px' }}>
                      <PushPinIcon />
                    </ListItemIcon>
                    <ListItemText primary={item} sx={{ color: "#757575" }} />
                  </ListItem >
                );
              })};
            </List>
            <Box component="div" sx={{ mt: 2 }}>
              <Typography variant="p" component="p">يمكنك الوصول إلى هذه الأقسام من القائمة الجانبية على اليمين، </Typography>
              <Typography variant="p" component="p">أولًا اختار الدرس الذي تريده ومن ثم اضغط عليه، ستظهر قائمة صغيرة بأربع أقسام شرح الدرس والأسئلة والمحادثة وأخيرًا الترجمة.</Typography>
              <Typography variant="p" component="p">سيظهر لك القسم الذي اخترته وذلك من خلال ChatGPT والذي استخدمناه ليساعدك على تعلم اللغة الإنجليزية.</Typography>
            </Box>
            <Box component="div" sx={{ mt: 2 }}>
              <Typography variant="p" component="p">أيضًا في الأسفل لديك قسم اسألني وهذا القسم يمكنك من خلاله الحديث مع ChatGPT وسؤاله عن ماتريد أن يشرح لك أو يساعدك فيه.</Typography>
            </Box>
          </CardContent>
          :
          <CardContent sx={{ mb: 12 }}>
            {messages.map((msg, index) => (
              <Box key={index} sx={{ mb: 3, textAlign: msg.role === 'user' ? 'right' : 'left' }}>
                <Typography sx={{ fontWeight: 'bold', mb: 1, fontSize: '14px', color: msg.role === 'user' ? '#1976d2' : '#388e3c' }}>
                  {msg.role === 'user' ? 'أنت' : 'المساعد'}:
                </Typography>
                <Typography sx={{ fontSize: '16px', lineHeight: 1.6 }} variant="p" component="div">
                  {msg.content.split(/\n/).map((line, i) => <p key={i}>{line}</p>)}
                </Typography>
              </Box>
            ))}
          </CardContent>
      }
    </MainLayout>
  );
};
