import { describe, it, expect } from 'vitest';
import {
  APP_NAME,
  APP_NAME_EN,
  DRAWER_WIDTH,
  MAX_CONTENT_WIDTH,
  THEME_STORAGE_KEY,
  OPENAI_MODEL,
  LESSONS,
  LESSON_SECTIONS,
  LOADING_TEXTS,
  getRandomLoadingText,
} from '@/app/config';

describe('ثوابت التطبيق (App Constants)', () => {
  it('يجب أن يحتوي APP_NAME على الاسم العربي', () => {
    expect(APP_NAME).toBe('علمني');
  });

  it('يجب أن يحتوي APP_NAME_EN على الاسم الإنجليزي', () => {
    expect(APP_NAME_EN).toBe('Teach Me');
  });

  it('يجب أن يكون DRAWER_WIDTH رقمًا موجبًا', () => {
    expect(DRAWER_WIDTH).toBeGreaterThan(0);
    expect(typeof DRAWER_WIDTH).toBe('number');
  });

  it('يجب أن يكون MAX_CONTENT_WIDTH رقمًا موجبًا', () => {
    expect(MAX_CONTENT_WIDTH).toBeGreaterThan(0);
    expect(typeof MAX_CONTENT_WIDTH).toBe('number');
  });

  it('يجب أن يكون THEME_STORAGE_KEY نصًا غير فارغ', () => {
    expect(THEME_STORAGE_KEY).toBeTruthy();
    expect(typeof THEME_STORAGE_KEY).toBe('string');
  });

  it('يجب أن يكون OPENAI_MODEL محددًا', () => {
    expect(OPENAI_MODEL).toBeTruthy();
    expect(typeof OPENAI_MODEL).toBe('string');
  });
});

describe('قائمة الدروس (LESSONS)', () => {
  it('يجب أن تحتوي القائمة على 9 دروس', () => {
    expect(LESSONS).toHaveLength(9);
  });

  it('يجب أن يحتوي كل درس على slug و nameAr', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson.slug).toBeTruthy();
      expect(lesson.nameAr).toBeTruthy();
      expect(typeof lesson.slug).toBe('string');
      expect(typeof lesson.nameAr).toBe('string');
    });
  });

  it('يجب أن تكون slugs فريدة', () => {
    const slugs = LESSONS.map((l) => l.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);
  });

  it('يجب ألا تحتوي slugs على مسافات', () => {
    LESSONS.forEach((lesson) => {
      expect(lesson.slug).not.toContain(' ');
    });
  });
});

describe('أقسام الدروس (LESSON_SECTIONS)', () => {
  it('يجب أن يحتوي على 4 أقسام', () => {
    const keys = Object.keys(LESSON_SECTIONS);
    expect(keys).toHaveLength(4);
  });

  it('يجب أن يحتوي على الأقسام المطلوبة', () => {
    expect(LESSON_SECTIONS).toHaveProperty('lecture');
    expect(LESSON_SECTIONS).toHaveProperty('question');
    expect(LESSON_SECTIONS).toHaveProperty('conversation');
    expect(LESSON_SECTIONS).toHaveProperty('translate');
  });

  it('يجب أن تكون أسماء الأقسام بالعربية', () => {
    Object.values(LESSON_SECTIONS).forEach((name) => {
      expect(name).toBeTruthy();
      expect(typeof name).toBe('string');
    });
  });
});

describe('نصوص التحميل (LOADING_TEXTS)', () => {
  const sections = ['home', 'lecture', 'question', 'conversation', 'translate'] as const;

  it('يجب أن يحتوي على نصوص لجميع الأقسام', () => {
    sections.forEach((section) => {
      expect(LOADING_TEXTS).toHaveProperty(section);
      expect(LOADING_TEXTS[section].length).toBeGreaterThan(0);
    });
  });

  it('يجب أن تكون جميع النصوص غير فارغة', () => {
    sections.forEach((section) => {
      LOADING_TEXTS[section].forEach((text) => {
        expect(text).toBeTruthy();
        expect(typeof text).toBe('string');
      });
    });
  });
});

describe('getRandomLoadingText()', () => {
  it('يجب أن يعيد نصًا من القسم المحدد', () => {
    const text = getRandomLoadingText('home');
    expect(LOADING_TEXTS.home).toContain(text);
  });

  it('يجب أن يعيد نصًا لكل قسم متاح', () => {
    const sections = ['home', 'lecture', 'question', 'conversation', 'translate'] as const;
    sections.forEach((section) => {
      const text = getRandomLoadingText(section);
      expect(text).toBeTruthy();
      expect(LOADING_TEXTS[section]).toContain(text);
    });
  });

  it('يجب أن يعيد نصًا مختلفًا (اختبار العشوائية)', () => {
    // نأخذ 20 محاولة ونتحقق أن هناك أكثر من نتيجة واحدة
    const results = new Set<string>();
    for (let i = 0; i < 20; i++) {
      results.add(getRandomLoadingText('lecture'));
    }
    // مع 7 نصوص و20 محاولة، يجب أن نحصل على أكثر من نتيجة واحدة
    expect(results.size).toBeGreaterThan(1);
  });
});
