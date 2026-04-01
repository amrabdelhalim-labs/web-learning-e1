'use client';

import { useEffect, useMemo, useState } from 'react';
import { Drawer, Box, List } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/app/hooks/useAppContext';
import CustomizedListItem from '@/app/components/SideBar/CustomizedListItem';
import MenuToolbar from './MenuToolbar';
import MenuFooter from './MenuFooter';
import { LESSONS } from '@/app/config';
import type { LessonSection } from '@/app/types';

export default function SideBar() {
  const { openMobile, setOpenMobile, drawerWidth } = useAppContext();
  const pathname = usePathname();
  const [expandedLessonSlug, setExpandedLessonSlug] = useState<string | null>(null);

  const { currentLessonSlug, currentSection } = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean);
    const lessonSlug = LESSONS.some((lesson) => lesson.slug === segments[0]) ? segments[0] : null;
    const section = (segments[1] ?? null) as LessonSection | null;

    return { currentLessonSlug: lessonSlug, currentSection: section };
  }, [pathname]);

  useEffect(() => {
    if (currentLessonSlug) {
      setExpandedLessonSlug(currentLessonSlug);
    }
  }, [currentLessonSlug]);

  const handleDrawerToggle = () => {
    setOpenMobile(!openMobile);
  };

  const renderDrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <MenuToolbar />
      <List
        component="ul"
        disablePadding
        sx={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {LESSONS.map((lesson) => (
          <CustomizedListItem
            key={lesson.slug}
            lectureName={lesson.nameAr}
            lectureSlug={lesson.slug}
            isExpanded={expandedLessonSlug === lesson.slug}
            isCurrentLesson={currentLessonSlug === lesson.slug}
            currentSection={currentSection}
            onToggle={() =>
              setExpandedLessonSlug((prev) => (prev === lesson.slug ? null : lesson.slug))
            }
          />
        ))}
      </List>
      <MenuFooter />
    </Box>
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
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        slotProps={{
          root: { keepMounted: true },
        }}
      >
        {renderDrawerContent()}
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
            display: 'flex',
            flexDirection: 'column',
          },
        }}
        open
      >
        {renderDrawerContent()}
      </Drawer>
    </Box>
  );
}
