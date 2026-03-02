'use client';

import type { ReactNode } from 'react';
import {
  Box,
  Toolbar,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton,
  Typography,
  Fade,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SideBar from '@/app/components/SideBar/SideBar';
import ToolBar from '@/app/components/ToolBar/ToolBar';
import Footer from '@/app/components/Footer/Footer';
import { useAppContext } from '@/app/hooks/useAppContext';
import { MAX_CONTENT_WIDTH } from '@/app/config';

interface MainLayoutProps {
  children: ReactNode;
  loading?: boolean;
  loadingText?: string;
  onButtonClick?: () => void;
}

export default function MainLayout({
  children,
  loading = false,
  loadingText = '',
  onButtonClick,
}: MainLayoutProps) {
  const { drawerWidth, errorMessage, showAlert, setShowAlert } = useAppContext();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <ToolBar />
      <SideBar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mx: 'auto',
          maxWidth: MAX_CONTENT_WIDTH,
        }}
      >
        <Toolbar />
        {loading ? (
          <Fade in>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                minHeight: '60vh',
              }}
            >
              <CircularProgress size={56} thickness={3} />
              <Typography
                component="p"
                sx={{
                  fontSize: '15px',
                  color: 'text.secondary',
                  textAlign: 'center',
                  mt: 3,
                  maxWidth: 300,
                }}
              >
                {loadingText}
              </Typography>
            </Box>
          </Fade>
        ) : (
          <Fade in>{<div>{children}</div>}</Fade>
        )}
      </Box>

      <Footer onButtonClick={onButtonClick} />

      <Snackbar
        open={showAlert}
        autoHideDuration={6000}
        onClose={() => setShowAlert(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          sx={{ width: '100%' }}
          action={
            <IconButton
              size="small"
              aria-label="إغلاق"
              color="inherit"
              onClick={() => setShowAlert(false)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
