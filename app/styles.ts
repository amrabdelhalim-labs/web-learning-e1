import type { SxProps, Theme } from '@mui/material';

/**
 * Centralized responsive font-size scale (rem-based for accessibility).
 * Use these instead of hardcoded px values across pages.
 */
export const fontSize = {
  /** Page titles — 20px on mobile, 22px on desktop */
  pageTitle: { xs: '1.25rem', sm: '1.375rem' },
  /** Primary body/content text — 16px */
  body: '1rem',
  /** Highlighted/prominent text (sentences, questions) — 18px */
  highlight: '1.125rem',
  /** Secondary text (loading, helpers) — 15px */
  secondary: '0.9375rem',
  /** Small caption text — 13px */
  caption: '0.8125rem',
} as const;

/**
 * Section-specific color palettes for dark/light modes.
 * Each palette defines background, border, and text colors.
 */
export const sectionColors = {
  /** Green palette — used for answer/feedback sections */
  answer: {
    bg: (mode: string) => (mode === 'dark' ? '#1b5e20' : '#e8f5e9'),
    border: '#2e7d32',
    text: (mode: string) => (mode === 'dark' ? '#c8e6c9' : '#1b5e20'),
    subtleText: (mode: string) => (mode === 'dark' ? '#b0d4b8' : '#558b2f'),
  },
  /** Purple palette — used for question/prompt sections */
  question: {
    bg: (mode: string) => (mode === 'dark' ? '#1a237e' : '#f3e5f5'),
    border: '#3f51b5',
    text: (mode: string) => (mode === 'dark' ? '#c5cae9' : '#4a148c'),
  },
  /** Blue palette — used for lecture/explanation sections */
  lecture: {
    bg: (mode: string) => (mode === 'dark' ? '#0d1f29' : '#f0f4f8'),
    border: (mode: string) => (mode === 'dark' ? '#1976d2' : '#1565c0'),
    text: (mode: string) => (mode === 'dark' ? '#b3e5fc' : '#0d47a1'),
  },
} as const;

/** Common bottom margin for CardContent to prevent footer overlap */
export const CONTENT_BOTTOM_MARGIN = 14;

/** Reusable Paper base styles (responsive padding) */
export const paperBase: SxProps<Theme> = {
  p: { xs: 1.5, sm: 2.5 },
  borderRadius: 2,
};

/** Answer feedback Paper styles (green) */
export const answerPaperSx = (mode: string): SxProps<Theme> => ({
  ...paperBase,
  backgroundColor: sectionColors.answer.bg(mode),
  border: 2,
  borderColor: sectionColors.answer.border,
});

/** Compact feedback cards: balanced spacing for short dynamic responses */
export const compactFeedbackCardSx = {
  p: { xs: 1.75, sm: 2.25 },
  borderRadius: 2,
  display: 'grid',
  gap: { xs: 0.75, sm: 1 },
};

/** Question/prompt Paper styles (purple) */
export const questionPaperSx = (mode: string): SxProps<Theme> => ({
  ...paperBase,
  backgroundColor: sectionColors.question.bg(mode),
  border: 2,
  borderColor: sectionColors.question.border,
});

/** Lecture Paper styles (blue) */
export const lecturePaperSx = (mode: string): SxProps<Theme> => ({
  ...paperBase,
  backgroundColor: sectionColors.lecture.bg(mode),
  border: 2,
  borderColor: sectionColors.lecture.border(mode),
});

/** Neutral Paper styles (used on homepage) */
export const neutralPaperSx: SxProps<Theme> = {
  ...paperBase,
  backgroundColor: 'action.hover',
  border: 1,
  borderColor: 'divider',
};
