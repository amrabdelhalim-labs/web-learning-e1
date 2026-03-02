'use client';

import { AppBar, Toolbar, IconButton, Typography, Tooltip, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/app/hooks/useAppContext';
import { useThemeMode } from '@/app/hooks/useThemeMode';
import { APP_NAME } from '@/app/config';

export default function ToolBar() {
  const router = useRouter();
  const { openMobile, setOpenMobile, drawerWidth, setShowFooterButton } = useAppContext();
  const { mode, toggleTheme } = useThemeMode();

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        backdropFilter: 'blur(8px)',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(19, 47, 76, 0.8)',
        borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        color: 'text.primary',
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="فتح القائمة"
          edge="start"
          onClick={() => setOpenMobile(!openMobile)}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          noWrap
          component="div"
          onClick={() => {
            router.push('/');
            setShowFooterButton(false);
          }}
          sx={{
            cursor: 'pointer',
            mr: 'auto',
            fontSize: '20px',
            fontWeight: 'bold',
            background: (theme) =>
              theme.palette.mode === 'light'
                ? 'linear-gradient(135deg, #1565c0, #7c4dff)'
                : 'linear-gradient(135deg, #90caf9, #b388ff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {APP_NAME}
        </Typography>

        <Box>
          <Tooltip title={mode === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}>
            <IconButton color="inherit" onClick={toggleTheme} size="small">
              {mode === 'light' ? (
                <DarkModeIcon fontSize="small" />
              ) : (
                <LightModeIcon fontSize="small" sx={{ color: '#ffd54f' }} />
              )}
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
