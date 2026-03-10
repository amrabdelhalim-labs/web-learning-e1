'use client';

import { Box, useTheme } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';

interface MarkdownRendererProps {
  content: string;
  color?: string;
}

export default function MarkdownRenderer({ content, color }: MarkdownRendererProps) {
  const theme = useTheme();
  const textColor = color || theme.palette.text.primary;

  const components: Components = {
    p: ({ children }) => (
      <Box component="p" sx={{ my: 1, lineHeight: 1.8, color: textColor }}>
        {children}
      </Box>
    ),
    h1: ({ children }) => (
      <Box component="h1" sx={{ fontSize: '1.5rem', fontWeight: 700, my: 2, color: textColor }}>
        {children}
      </Box>
    ),
    h2: ({ children }) => (
      <Box component="h2" sx={{ fontSize: '1.3rem', fontWeight: 600, my: 1.5, color: textColor }}>
        {children}
      </Box>
    ),
    h3: ({ children }) => (
      <Box component="h3" sx={{ fontSize: '1.1rem', fontWeight: 600, my: 1, color: textColor }}>
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ pr: 3, my: 1, color: textColor }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ pr: 3, my: 1, color: textColor }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Box component="li" sx={{ my: 0.5, lineHeight: 1.8, color: textColor }}>
        {children}
      </Box>
    ),
    strong: ({ children }) => (
      <Box component="strong" sx={{ fontWeight: 700, color: textColor }}>
        {children}
      </Box>
    ),
    code: ({ children, className }) => {
      const isInline = !className;
      return isInline ? (
        <Box
          component="code"
          sx={{
            backgroundColor:
              theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
            px: 0.8,
            py: 0.2,
            borderRadius: '4px',
            fontSize: '0.9em',
            fontFamily: 'monospace',
            direction: 'ltr',
            display: 'inline',
          }}
        >
          {children}
        </Box>
      ) : (
        <Box
          component="pre"
          sx={{
            backgroundColor: theme.palette.mode === 'dark' ? '#1a1a2e' : '#f5f5f5',
            p: 2,
            borderRadius: 1,
            overflow: 'auto',
            my: 1,
            direction: 'ltr',
            textAlign: 'left',
          }}
        >
          <Box component="code" sx={{ fontFamily: 'monospace', fontSize: '0.9em' }}>
            {children}
          </Box>
        </Box>
      );
    },
    blockquote: ({ children }) => (
      <Box
        component="blockquote"
        sx={{
          borderRight: `4px solid ${theme.palette.primary.main}`,
          pr: 2,
          my: 1,
          color: theme.palette.text.secondary,
          fontStyle: 'italic',
        }}
      >
        {children}
      </Box>
    ),
    table: ({ children }) => (
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          my: 2,
          '& th, & td': {
            border: `1px solid ${theme.palette.divider}`,
            p: 1,
            textAlign: 'right',
          },
          '& th': {
            backgroundColor: theme.palette.action.hover,
            fontWeight: 600,
          },
        }}
      >
        {children}
      </Box>
    ),
    hr: () => (
      <Box
        component="hr"
        sx={{
          border: 'none',
          borderTop: `1px solid ${theme.palette.divider}`,
          my: 2,
        }}
      />
    ),
  };

  return (
    <Box sx={{ fontSize: '16px', lineHeight: 1.8, direction: 'rtl' }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
