'use client';

import { Drawer, Box } from '@mui/material';
import { useAppContext } from '@/app/hooks/useAppContext';
import CustomizedListItem from '@/app/components/SideBar/CustomizedListItem';
import MenuToolbar from './MenuToolbar';
import MenuFooter from './MenuFooter';
import { LESSONS } from '@/app/config';

export default function SideBar() {
  const { openMobile, setOpenMobile, drawerWidth } = useAppContext();

  const handleDrawerToggle = () => {
    setOpenMobile(!openMobile);
  };

  const drawerContent = (
    <>
      <MenuToolbar />
      {LESSONS.map((lesson) => (
        <CustomizedListItem
          key={lesson.slug}
          lectureName={lesson.nameAr}
          lectureSlug={lesson.slug}
        />
      ))}
      <MenuFooter />
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="الدروس"
    >
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={openMobile}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
          },
        }}
        slotProps={{
          root: { keepMounted: true },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderLeft: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
