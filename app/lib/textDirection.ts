import type { ReactNode } from 'react';

const RTL_CHAR_REGEX = /[\u0590-\u08FF]/;
const LTR_CHAR_REGEX = /[A-Za-z]/;
const STRONG_CHAR_REGEX = /[\u0590-\u08FFA-Za-z]/g;
const TECHNICAL_TOKEN_REGEX =
  /[`~@#%^&*_=+\\|/<>\[\]{}]|https?:\/\/|\/[A-Za-z0-9_.-]+|[A-Za-z0-9_.-]+\.[A-Za-z]{2,}|\w+=\w+/;
const TRAILING_PUNCTUATION_REGEX = /([,.;:!?،؛؟]+)$/;
const ARABIC_END_PUNCTUATION_REGEX = /[؟،؛]\s*$/;
const ENGLISH_END_PUNCTUATION_REGEX = /[!?.,;:]\s*$/;
const TECHNICAL_FRAGMENT_REGEX =
  /https?:\/\/\S+|\/[A-Za-z0-9_.\-\/]+|`[^`]+`|[A-Za-z0-9]+(?:[._/-][A-Za-z0-9]+)+(?:=[^\s`'"،؛؟,.!?]+)?|[A-Za-z_][A-Za-z0-9_]*=[^\s`'"،؛؟,.!?]+/g;

function flattenNodeText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(flattenNodeText).join('');
  if (typeof node === 'object' && 'props' in node) {
    return flattenNodeText((node as { props?: { children?: ReactNode } }).props?.children);
  }
  return '';
}

export function getNodeText(input: ReactNode): string {
  return flattenNodeText(input).trim();
}

export function getTextDirection(input: ReactNode): 'rtl' | 'ltr' | 'auto' {
  const text = getNodeText(input);
  const hasRtl = RTL_CHAR_REGEX.test(text);
  const hasLtr = LTR_CHAR_REGEX.test(text);

  // Final punctuation should anchor to semantic sentence direction.
  if (hasRtl && ARABIC_END_PUNCTUATION_REGEX.test(text)) return 'rtl';
  if (!hasRtl && hasLtr && ENGLISH_END_PUNCTUATION_REGEX.test(text)) return 'ltr';

  const semanticText = text.replace(TECHNICAL_FRAGMENT_REGEX, ' ');
  const matches = semanticText.match(STRONG_CHAR_REGEX) || text.match(STRONG_CHAR_REGEX);
  if (!matches || matches.length === 0) return 'auto';

  let rtlCount = 0;
  let ltrCount = 0;
  for (const char of matches) {
    if (RTL_CHAR_REGEX.test(char)) rtlCount += 1;
    if (LTR_CHAR_REGEX.test(char)) ltrCount += 1;
  }

  if (rtlCount > ltrCount) return 'rtl';
  if (ltrCount > rtlCount) return 'ltr';

  const firstStrongChar = matches.find(
    (char) => RTL_CHAR_REGEX.test(char) || LTR_CHAR_REGEX.test(char)
  );
  if (!firstStrongChar) return 'auto';
  if (RTL_CHAR_REGEX.test(firstStrongChar)) return 'rtl';
  if (LTR_CHAR_REGEX.test(firstStrongChar)) return 'ltr';
  return 'auto';
}

export function isLikelyTechnicalToken(input: ReactNode): boolean {
  const text = getNodeText(input);
  if (!text) return false;
  return TECHNICAL_TOKEN_REGEX.test(text);
}

export function splitTrailingPunctuation(text: string): { core: string; trailing: string } {
  const match = text.match(TRAILING_PUNCTUATION_REGEX);
  if (!match) return { core: text, trailing: '' };
  const trailing = match[1];
  return { core: text.slice(0, -trailing.length), trailing };
}
