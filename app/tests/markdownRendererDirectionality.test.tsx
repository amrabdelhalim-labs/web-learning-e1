import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MarkdownRenderer from '@/app/components/MarkdownRenderer';
import { getTextDirection, isLikelyTechnicalToken, splitTrailingPunctuation } from '@/app/lib/textDirection';

describe('getTextDirection()', () => {
  it('detects Arabic-first content as rtl', () => {
    expect(getTextDirection('هذا شرح لدرس البرمجة')).toBe('rtl');
  });

  it('detects English-first content as ltr', () => {
    expect(getTextDirection('This is an API explanation')).toBe('ltr');
  });

  it('returns auto for neutral symbols', () => {
    expect(getTextDirection('1234 / - ( )')).toBe('auto');
  });

  it('detects technical symbols and assignments as technical tokens', () => {
    expect(isLikelyTechnicalToken('/api/health')).toBe(true);
    expect(isLikelyTechnicalToken('JWT_SECRET=test')).toBe(true);
    expect(isLikelyTechnicalToken('https://nextjs.org/docs')).toBe(true);
    expect(isLikelyTechnicalToken('نص عربي طبيعي')).toBe(false);
  });

  it('splits trailing punctuation from technical tokens', () => {
    expect(splitTrailingPunctuation('https://nextjs.org/docs،')).toEqual({
      core: 'https://nextjs.org/docs',
      trailing: '،',
    });
    expect(splitTrailingPunctuation('/api/health?')).toEqual({
      core: '/api/health',
      trailing: '?',
    });
  });
});

describe('MarkdownRenderer multilingual rendering', () => {
  it('renders Arabic/English mixed markdown with semantic direction and stable code blocks', () => {
    const content = `# شرح API مع أمثلة

هذا شرح عربي يحتوي مصطلحات إنجليزية مثل API و endpoint ويشمل أمر \`npm run dev\` وملف \`app/page.tsx\` ومفتاح \`JWT_SECRET\`.

## خطوات التشغيل

- شغّل الأمر \`npm run dev\`
- افتح المسار \`/api/chat-completion\`
- راجع الملف \`app/page.tsx\`

> ملاحظة: استخدم متغير البيئة \`JWT_SECRET\` بشكل آمن.

| الحقل | القيمة |
|---|---|
| endpoint | /api/chat-completion |
| env | JWT_SECRET |

\`\`\`ts
const endpoint = '/api/chat-completion';
const command = 'npm run dev';
console.log(endpoint, command);
\`\`\`

Read more at https://example.com/docs`;

    const { container } = render(<MarkdownRenderer content={content} />);

    const heading = screen.getByRole('heading', { name: 'شرح API مع أمثلة' });
    expect(heading).toHaveAttribute('dir', 'rtl');

    const paragraph = screen.getByText(/هذا شرح عربي يحتوي مصطلحات إنجليزية/);
    expect(paragraph.tagName.toLowerCase()).toBe('p');
    expect(paragraph).toHaveAttribute('dir', 'rtl');

    const inlineCodeText = screen.getAllByText('npm run dev')[0];
    const inlineCode = inlineCodeText.closest('code');
    expect(inlineCode).toBeInTheDocument();
    expect(inlineCode).toHaveStyle({ direction: 'ltr' });

    const codeBlock = container.querySelector('pre pre');
    expect(codeBlock).toBeInTheDocument();
    expect(codeBlock).toHaveStyle({ direction: 'ltr', textAlign: 'left' });

    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toBeInTheDocument();
    expect(blockquote).toHaveAttribute('dir', 'rtl');

    const englishCell = screen.getByRole('cell', { name: 'endpoint' });
    expect(englishCell).toHaveAttribute('dir', 'ltr');

    const arabicHeader = screen.getByRole('columnheader', { name: 'الحقل' });
    expect(arabicHeader).toHaveAttribute('dir', 'rtl');
  });

  it('keeps English paragraphs in ltr and supports embedded Arabic phrase', () => {
    const content = `This endpoint returns markdown output and includes the Arabic phrase مرحبا بك.

Use \`npm run build\` before deploy.`;

    render(<MarkdownRenderer content={content} />);

    const paragraph = screen.getByText(/This endpoint returns markdown output/);
    expect(paragraph).toHaveAttribute('dir', 'ltr');
    expect(screen.getByText('npm run build')).toHaveStyle({ direction: 'ltr' });
  });

  it('keeps punctuation stable with mixed Arabic text and technical inline tokens', () => {
    const content = `هل تستخدم \`Next.js\` أم \`React\`؟

شغّل الأمر \`npm run dev\` ثم افتح \`/api/health\`.

هل المشكلة في \`app/page.tsx\` أو \`middleware.ts\`?

The fix is in \`auth.ts\`, صح؟

هل جرّبت \`JWT_SECRET=test\`؟

> مثال: الرابط https://nextjs.org/docs، ثم جرّب المسار /api/chat-completion.
`;

    const { container } = render(<MarkdownRenderer content={content} />);

    const questionLine = screen.getByText(/هل تستخدم/);
    expect(questionLine).toHaveAttribute('dir', 'rtl');

    const endpointTokenText = screen.getByText('/api/health');
    const endpointToken = endpointTokenText.closest('code');
    expect(endpointToken).toBeInTheDocument();
    expect(endpointToken).toHaveStyle({ direction: 'ltr' });
    expect(endpointTokenText.tagName.toLowerCase()).toBe('bdi');

    const assignmentToken = screen.getByText('JWT_SECRET=test');
    expect(assignmentToken).toHaveStyle({ direction: 'ltr' });

    const englishMixedLine = screen.getByText(/The fix is in/);
    expect(englishMixedLine).toHaveAttribute('dir', 'ltr');

    const link = screen.getByRole('link', { name: 'https://nextjs.org/docs' });
    expect(link).toHaveAttribute('dir', 'ltr');
    expect(link).toHaveAttribute('href', 'https://nextjs.org/docs');
    expect(link.querySelector('bdi')).toBeInTheDocument();
    expect(container.textContent).toContain('https://nextjs.org/docs،');

    const blockquote = container.querySelector('blockquote');
    expect(blockquote).toHaveAttribute('dir', 'rtl');
  });
});
