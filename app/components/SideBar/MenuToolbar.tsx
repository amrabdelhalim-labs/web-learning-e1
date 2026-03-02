'use client';

import { Toolbar, Typography, Divider, Box } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import { APP_NAME } from '@/app/config';

export default function MenuToolbar() {
  return (
    <>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AutoStoriesIcon color="primary" />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontSize: '18px' }}>
            دروس {APP_NAME}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
    </>
  );
}
