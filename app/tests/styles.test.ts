import { describe, it, expect } from 'vitest';
import {
  sectionColors,
  CONTENT_BOTTOM_MARGIN,
  paperBase,
  answerPaperSx,
  questionPaperSx,
  lecturePaperSx,
  neutralPaperSx,
  fontSize,
} from '@/app/styles';

describe('ألوان الأقسام (sectionColors)', () => {
  describe('قسم الإجابات (answer)', () => {
    it('يجب أن يعيد ألوان الخلفية الصحيحة للوضع الداكن والفاتح', () => {
      expect(sectionColors.answer.bg('dark')).toBe('#1b5e20');
      expect(sectionColors.answer.bg('light')).toBe('#e8f5e9');
    });

    it('يجب أن يعيد لون الحدود الصحيح', () => {
      expect(sectionColors.answer.border).toBe('#2e7d32');
    });

    it('يجب أن يعيد ألوان النص الصحيحة', () => {
      expect(sectionColors.answer.text('dark')).toBe('#c8e6c9');
      expect(sectionColors.answer.text('light')).toBe('#1b5e20');
    });

    it('يجب أن يعيد ألوان النص الخافتة الصحيحة', () => {
      expect(sectionColors.answer.subtleText('dark')).toBe('#b0d4b8');
      expect(sectionColors.answer.subtleText('light')).toBe('#558b2f');
    });
  });

  describe('قسم الأسئلة (question)', () => {
    it('يجب أن يعيد ألوان الخلفية الصحيحة', () => {
      expect(sectionColors.question.bg('dark')).toBe('#1a237e');
      expect(sectionColors.question.bg('light')).toBe('#f3e5f5');
    });

    it('يجب أن يعيد لون الحدود الصحيح', () => {
      expect(sectionColors.question.border).toBe('#3f51b5');
    });

    it('يجب أن يعيد ألوان النص الصحيحة', () => {
      expect(sectionColors.question.text('dark')).toBe('#c5cae9');
      expect(sectionColors.question.text('light')).toBe('#4a148c');
    });
  });

  describe('قسم الشرح (lecture)', () => {
    it('يجب أن يعيد ألوان الخلفية الصحيحة', () => {
      expect(sectionColors.lecture.bg('dark')).toBe('#0d1f29');
      expect(sectionColors.lecture.bg('light')).toBe('#f0f4f8');
    });

    it('يجب أن يعيد ألوان الحدود الصحيحة', () => {
      expect(sectionColors.lecture.border('dark')).toBe('#1976d2');
      expect(sectionColors.lecture.border('light')).toBe('#1565c0');
    });

    it('يجب أن يعيد ألوان النص الصحيحة', () => {
      expect(sectionColors.lecture.text('dark')).toBe('#b3e5fc');
      expect(sectionColors.lecture.text('light')).toBe('#0d47a1');
    });
  });
});

describe('ثوابت التنسيق (Style Constants)', () => {
  it('يجب أن يكون CONTENT_BOTTOM_MARGIN رقمًا موجبًا', () => {
    expect(CONTENT_BOTTOM_MARGIN).toBe(14);
    expect(typeof CONTENT_BOTTOM_MARGIN).toBe('number');
  });

  it('يجب أن يحتوي paperBase على الخصائص الأساسية مع padding متجاوب', () => {
    expect(paperBase).toHaveProperty('p');
    expect((paperBase as Record<string, unknown>).p).toEqual({ xs: 1.5, sm: 2.5 });
    expect(paperBase).toHaveProperty('borderRadius', 2);
  });
});

describe('أنماط Paper المركزية (Paper Style Functions)', () => {
  it('يجب أن يعيد answerPaperSx الأنماط الصحيحة', () => {
    const darkStyles = answerPaperSx('dark');
    expect(darkStyles).toHaveProperty('backgroundColor', '#1b5e20');
    expect(darkStyles).toHaveProperty('border', 2);
    expect(darkStyles).toHaveProperty('borderColor', '#2e7d32');
    expect((darkStyles as Record<string, unknown>).p).toEqual({ xs: 1.5, sm: 2.5 });
    expect(darkStyles).toHaveProperty('borderRadius', 2);

    const lightStyles = answerPaperSx('light');
    expect(lightStyles).toHaveProperty('backgroundColor', '#e8f5e9');
  });

  it('يجب أن يعيد questionPaperSx الأنماط الصحيحة', () => {
    const darkStyles = questionPaperSx('dark');
    expect(darkStyles).toHaveProperty('backgroundColor', '#1a237e');
    expect(darkStyles).toHaveProperty('borderColor', '#3f51b5');

    const lightStyles = questionPaperSx('light');
    expect(lightStyles).toHaveProperty('backgroundColor', '#f3e5f5');
  });

  it('يجب أن يعيد lecturePaperSx الأنماط الصحيحة', () => {
    const darkStyles = lecturePaperSx('dark');
    expect(darkStyles).toHaveProperty('backgroundColor', '#0d1f29');
    expect(darkStyles).toHaveProperty('borderColor', '#1976d2');

    const lightStyles = lecturePaperSx('light');
    expect(lightStyles).toHaveProperty('backgroundColor', '#f0f4f8');
    expect(lightStyles).toHaveProperty('borderColor', '#1565c0');
  });

  it('يجب أن يحتوي neutralPaperSx على الأنماط الصحيحة', () => {
    expect(neutralPaperSx).toHaveProperty('backgroundColor', 'action.hover');
    expect(neutralPaperSx).toHaveProperty('border', 1);
    expect(neutralPaperSx).toHaveProperty('borderColor', 'divider');
    expect((neutralPaperSx as Record<string, unknown>).p).toEqual({ xs: 1.5, sm: 2.5 });
    expect(neutralPaperSx).toHaveProperty('borderRadius', 2);
  });
});

describe('مقياس الخطوط المركزي (fontSize)', () => {
  it('يجب أن يحتوي pageTitle على قيم متجاوبة', () => {
    expect(fontSize.pageTitle).toEqual({ xs: '1.25rem', sm: '1.375rem' });
  });

  it('يجب أن يحتوي على أحجام ثابتة للنصوص', () => {
    expect(fontSize.body).toBe('1rem');
    expect(fontSize.highlight).toBe('1.125rem');
    expect(fontSize.secondary).toBe('0.9375rem');
    expect(fontSize.caption).toBe('0.8125rem');
  });

  it('يجب أن تكون جميع القيم بوحدة rem', () => {
    const values = [
      fontSize.body,
      fontSize.highlight,
      fontSize.secondary,
      fontSize.caption,
      fontSize.pageTitle.xs,
      fontSize.pageTitle.sm,
    ];
    values.forEach((v) => {
      expect(v).toMatch(/^\d+(\.\d+)?rem$/);
    });
  });
});
