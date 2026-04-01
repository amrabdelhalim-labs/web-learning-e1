'use client';

import { Typography, Box } from '@mui/material';
import SmartToyIcon from '@mui/icons-material/SmartToy';

export default function MenuFooter() {
  const year = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        mt: 'auto',
        py: 2,
        textAlign: 'center',
        width: '100%',
        px: 2,
      }}
    >
      <SmartToyIcon sx={{ fontSize: 32, color: 'primary.main', mb: 0.5 }} />
      <Typography
        variant="caption"
        component="p"
        sx={{ color: 'text.secondary', fontSize: '11px' }}
      >
        يستعمل تقنية OpenAI
      </Typography>
      <Typography
        variant="caption"
        component="p"
        sx={{ color: 'text.secondary', fontSize: '11px' }}
      >
        جميع الحقوق محفوظة © {year}
      </Typography>
    </Box>
  );
}
