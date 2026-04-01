'use client';

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
import { useAppContext } from '@/app/hooks/useAppContext';
import { LESSON_SECTIONS } from '@/app/config';
import type { LessonSection } from '@/app/types';

interface CustomizedListItemProps {
  lectureName: string;
  lectureSlug: string;
  isExpanded: boolean;
  isCurrentLesson: boolean;
  currentSection: LessonSection | null;
  onToggle: () => void;
}

const sectionIcons: Record<LessonSection, React.ReactElement> = {
  lecture: <CastForEducationIcon />,
  question: <QuestionAnswerIcon />,
  conversation: <RecordVoiceOverIcon />,
  translate: <TranslateIcon />,
};

export default function CustomizedListItem({
  lectureName,
  lectureSlug,
  isExpanded,
  isCurrentLesson,
  currentSection,
  onToggle,
}: CustomizedListItemProps) {
  const router = useRouter();
  const { setOpenMobile } = useAppContext();

  const sections = Object.entries(LESSON_SECTIONS) as [LessonSection, string][];

  return (
    <ListItem component="div" disablePadding sx={{ display: 'block' }}>
      <ListItemButton onClick={onToggle} aria-expanded={isExpanded}>
        <ListItemText primary={lectureName} primaryTypographyProps={{ fontSize: '14px' }} />
        {isExpanded ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {sections.map(([key, label]) => (
            <div key={`${lectureSlug}-${key}`}>
              <ListItem disablePadding>
                <ListItemButton
                  sx={{ pl: 4 }}
                  selected={isCurrentLesson && currentSection === key}
                  onClick={(event) => {
                    event.stopPropagation();
                    setOpenMobile(false);
                    router.push(`/${lectureSlug}/${key}`);
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>{sectionIcons[key]}</ListItemIcon>
                  <ListItemText primary={label} primaryTypographyProps={{ fontSize: '13px' }} />
                </ListItemButton>
              </ListItem>
              <Divider variant="inset" />
            </div>
          ))}
        </List>
      </Collapse>
    </ListItem>
  );
}
