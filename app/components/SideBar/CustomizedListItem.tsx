'use client';

import { useState } from 'react';
import {
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Collapse,
  ListItemIcon,
} from '@mui/material';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CastForEducationIcon from '@mui/icons-material/CastForEducation';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import TranslateIcon from '@mui/icons-material/Translate';
import { useRouter } from 'next/navigation';
import { LESSON_SECTIONS } from '@/app/config';
import type { LessonSection } from '@/app/types';

interface CustomizedListItemProps {
  lectureName: string;
  lectureSlug: string;
}

const sectionIcons: Record<LessonSection, React.ReactElement> = {
  lecture: <CastForEducationIcon />,
  question: <QuestionAnswerIcon />,
  conversation: <RecordVoiceOverIcon />,
  translate: <TranslateIcon />,
};

export default function CustomizedListItem({ lectureName, lectureSlug }: CustomizedListItemProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const sections = Object.entries(LESSON_SECTIONS) as [LessonSection, string][];

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={() => setOpen(!open)}>
          <ListItemText primary={lectureName} primaryTypographyProps={{ fontSize: '14px' }} />
          {open ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        {sections.map(([key, label]) => (
          <div key={key}>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{ pl: 4 }}
                onClick={() => {
                  setOpen(true);
                  router.push(`/${lectureSlug}/${key}`);
                }}
              >
                <ListItemIcon sx={{ minWidth: 36 }}>{sectionIcons[key]}</ListItemIcon>
                <ListItemText primary={label} primaryTypographyProps={{ fontSize: '13px' }} />
              </ListItemButton>
            </List>
            <Divider variant="inset" />
          </div>
        ))}
      </Collapse>
    </>
  );
}
