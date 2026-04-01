'use client';

import { Box, useTheme } from '@mui/material';
import type { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { Components } from 'react-markdown';
import {
  getTextDirection,
  getNodeText,
  isLikelyTechnicalToken,
  splitTrailingPunctuation,
} from '@/app/lib/textDirection';

interface MarkdownRendererProps {
  content: string;
  color?: string;
}

export default function MarkdownRenderer({ content, color }: MarkdownRendererProps) {
  const theme = useTheme();
  const textColor = color || theme.palette.text.primary;
  const getInlineDirection = (children: ReactNode, href?: string) => {
    const text = getNodeText(children);
    const technical =
      isLikelyTechnicalToken(children) || (href ? isLikelyTechnicalToken(href) : false);
    if (technical) return 'ltr' as const;
    return getTextDirection(text);
  };

  const components: Components = {
    p: ({ children }) => (
      <Box
        component="p"
        dir={getTextDirection(children)}
        sx={{
          my: 1,
          lineHeight: 1.8,
          color: textColor,
          textAlign: 'start',
          unicodeBidi: 'plaintext',
        }}
      >
        {children}
      </Box>
    ),
    h1: ({ children }) => (
      <Box
        component="h1"
        dir={getTextDirection(children)}
        sx={{ fontSize: '1.5rem', fontWeight: 700, my: 2, color: textColor, textAlign: 'start' }}
      >
        {children}
      </Box>
    ),
    h2: ({ children }) => (
      <Box
        component="h2"
        dir={getTextDirection(children)}
        sx={{ fontSize: '1.3rem', fontWeight: 600, my: 1.5, color: textColor, textAlign: 'start' }}
      >
        {children}
      </Box>
    ),
    h3: ({ children }) => (
      <Box
        component="h3"
        dir={getTextDirection(children)}
        sx={{ fontSize: '1.1rem', fontWeight: 600, my: 1, color: textColor, textAlign: 'start' }}
      >
        {children}
      </Box>
    ),
    ul: ({ children }) => (
      <Box component="ul" sx={{ my: 1, color: textColor, ps: 3, textAlign: 'start' }}>
        {children}
      </Box>
    ),
    ol: ({ children }) => (
      <Box component="ol" sx={{ my: 1, color: textColor, ps: 3, textAlign: 'start' }}>
        {children}
      </Box>
    ),
    li: ({ children }) => (
      <Box
        component="li"
        dir={getTextDirection(children)}
        sx={{
          my: 0.5,
          lineHeight: 1.8,
          color: textColor,
          textAlign: 'start',
          unicodeBidi: 'plaintext',
        }}
      >
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
            unicodeBidi: 'isolate',
            display: 'inline',
            textAlign: 'left',
            whiteSpace: 'pre-wrap',
          }}
        >
          <Box component="bdi" dir="ltr" sx={{ unicodeBidi: 'isolate' }}>
            {children}
          </Box>
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
            unicodeBidi: 'plaintext',
            whiteSpace: 'pre',
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
        dir={getTextDirection(children)}
        sx={{
          borderInlineStart: `4px solid ${theme.palette.primary.main}`,
          ps: 2,
          my: 1,
          color: theme.palette.text.secondary,
          fontStyle: 'italic',
          textAlign: 'start',
          unicodeBidi: 'plaintext',
        }}
      >
        {children}
      </Box>
    ),
    a: ({ href, children }) => {
      const rawText = getNodeText(children);
      const decodedHref = (() => {
        if (!href) return '';
        try {
          return decodeURI(href);
        } catch {
          return href;
        }
      })();
      const isAutolinkText = rawText === href || rawText === decodedHref;
      const { core, trailing } = isAutolinkText
        ? splitTrailingPunctuation(rawText)
        : { core: rawText, trailing: '' };
      const safeHref =
        href && isAutolinkText
          ? splitTrailingPunctuation(decodedHref).core.replace(/(%D8%8C|%D8%9B|%D8%9F)+$/i, '')
          : href;
      const linkDir = getInlineDirection(core || rawText, safeHref);

      return (
        <>
          <Box
            component="a"
            href={safeHref}
            target="_blank"
            rel="noreferrer noopener"
            dir={linkDir}
            sx={{
              color: theme.palette.primary.main,
              textDecoration: 'underline',
              wordBreak: 'break-word',
              unicodeBidi: 'isolate',
              textAlign: 'start',
            }}
          >
            <Box component="bdi" dir={linkDir} sx={{ unicodeBidi: 'isolate' }}>
              {core || children}
            </Box>
          </Box>
          {trailing}
        </>
      );
    },
    table: ({ children }) => (
      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
          my: 2,
        }}
      >
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            minWidth: 420,
            '& th, & td': {
              border: `1px solid ${theme.palette.divider}`,
              p: 1,
              textAlign: 'start',
              verticalAlign: 'top',
            },
            '& th': {
              backgroundColor: theme.palette.action.hover,
              fontWeight: 600,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    ),
    th: ({ children }) => (
      <Box component="th" dir={getTextDirection(children)} sx={{ unicodeBidi: 'plaintext' }}>
        {children}
      </Box>
    ),
    td: ({ children }) => (
      <Box component="td" dir={getTextDirection(children)} sx={{ unicodeBidi: 'plaintext' }}>
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
    <Box dir="auto" sx={{ fontSize: '16px', lineHeight: 1.8 }}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </Box>
  );
}
