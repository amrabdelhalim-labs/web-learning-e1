'use client';

import { Box, Button, IconButton, TextField, useTheme } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useAppContext } from '@/app/hooks/useAppContext';

interface FooterProps {
  onButtonClick?: () => void;
}

export default function Footer({ onButtonClick }: FooterProps) {
  const router = useRouter();
  const theme = useTheme();
  const [value, setValue] = useState('');
  const { drawerWidth, setMessageValue, showFooterButton, textButton } = useAppContext();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;
    setMessageValue(value);
    router.push('/');
    setValue('');
  };

  return (
    <Box
      component="footer"
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: { xs: '100%', sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        justifyContent: 'center',
        pb: 3,
        pt: 1,
        background:
          theme.palette.mode === 'light'
            ? 'linear-gradient(180deg, rgba(248,249,250,0) 0%, rgba(248,249,250,1) 40%)'
            : 'linear-gradient(180deg, rgba(10,25,41,0) 0%, rgba(10,25,41,1) 40%)',
        direction: 'ltr',
        zIndex: 10,
      }}
    >
      {showFooterButton && (
        <Button
          variant="outlined"
          sx={{
            display: 'block',
            mx: 'auto',
            mb: 1,
          }}
          onClick={onButtonClick}
        >
          {textButton}
        </Button>
      )}
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: { xs: '90%', sm: '70%', md: '50%' },
          position: 'relative',
          mx: 'auto',
        }}
      >
        <TextField
          label="اسألني"
          fullWidth
          value={value}
          onChange={(e) => setValue(e.target.value)}
          inputProps={{ dir: 'rtl' }}
          sx={{
            direction: 'rtl',
            '& .MuiOutlinedInput-root': {
              backgroundColor: theme.palette.background.paper,
            },
          }}
        />
        <IconButton
          aria-label="إرسال"
          type="submit"
          sx={{
            position: 'absolute',
            right: '2%',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'primary.main',
          }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
