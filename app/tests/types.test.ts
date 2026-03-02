import { describe, it, expect } from 'vitest';
import type {
  ChatMessage,
  ApiResponse,
  ChatCompletionData,
  TextCompletionData,
  TranscriptionData,
  ApiErrorData,
  ThemeMode,
  LessonItem,
  LessonSection,
  AppContextState,
  ThemeContextState,
  SlugPageParams,
} from '@/app/types';

describe('أنواع الرسائل (ChatMessage)', () => {
  it('يجب أن يقبل رسالة مستخدم', () => {
    const msg: ChatMessage = { role: 'user', content: 'مرحبًا' };
    expect(msg.role).toBe('user');
    expect(msg.content).toBe('مرحبًا');
  });

  it('يجب أن يقبل رسالة مساعد', () => {
    const msg: ChatMessage = { role: 'assistant', content: 'أهلاً بك' };
    expect(msg.role).toBe('assistant');
    expect(msg.content).toBe('أهلاً بك');
  });

  it('يجب أن يقبل رسالة نظام', () => {
    const msg: ChatMessage = { role: 'system', content: 'أنت معلم لغة إنجليزية' };
    expect(msg.role).toBe('system');
    expect(msg.content).toBe('أنت معلم لغة إنجليزية');
  });
});

describe('استجابة API (ApiResponse)', () => {
  it('يجب أن يحتوي على data و status', () => {
    const response: ApiResponse<ChatCompletionData> = {
      data: { role: 'assistant', content: 'Hello' },
      status: 200,
    };
    expect(response.status).toBe(200);
    expect(response.data.role).toBe('assistant');
    expect(response.data.content).toBe('Hello');
  });

  it('يجب أن يعمل مع TextCompletionData', () => {
    const response: ApiResponse<TextCompletionData> = {
      data: { text: 'Generated text' },
      status: 200,
    };
    expect(response.data.text).toBe('Generated text');
  });

  it('يجب أن يعمل مع TranscriptionData', () => {
    const response: ApiResponse<TranscriptionData> = {
      data: { text: 'Transcribed text' },
      status: 200,
    };
    expect(response.data.text).toBe('Transcribed text');
  });

  it('يجب أن يعمل مع ApiErrorData', () => {
    const response: ApiResponse<ApiErrorData> = {
      data: { error: 'خطأ في الخادم' },
      status: 500,
    };
    expect(response.data.error).toBe('خطأ في الخادم');
    expect(response.status).toBe(500);
  });
});

describe('وضع المظهر (ThemeMode)', () => {
  it('يجب أن يقبل القيمة light', () => {
    const mode: ThemeMode = 'light';
    expect(mode).toBe('light');
  });

  it('يجب أن يقبل القيمة dark', () => {
    const mode: ThemeMode = 'dark';
    expect(mode).toBe('dark');
  });
});

describe('بنية الدرس (LessonItem)', () => {
  it('يجب أن يحتوي على slug و nameAr', () => {
    const lesson: LessonItem = { slug: 'Simple-present', nameAr: 'المضارع البسيط' };
    expect(lesson.slug).toBe('Simple-present');
    expect(lesson.nameAr).toBe('المضارع البسيط');
  });
});

describe('أقسام الدرس (LessonSection)', () => {
  it('يجب أن يقبل جميع الأقسام المتاحة', () => {
    const sections: LessonSection[] = ['lecture', 'question', 'conversation', 'translate'];
    expect(sections).toHaveLength(4);
    sections.forEach((section) => {
      expect(['lecture', 'question', 'conversation', 'translate']).toContain(section);
    });
  });
});

describe('حالة سياق التطبيق (AppContextState)', () => {
  it('يجب أن يحتوي على جميع الخصائص المطلوبة', () => {
    const mockState: Partial<AppContextState> = {
      openMobile: false,
      drawerWidth: 270,
      messageValue: '',
      contextPreviousMessage: [],
      messages: [],
      showAlert: false,
      errorMessage: '',
      textButton: 'إرسال',
      showFooterButton: true,
    };
    expect(mockState.openMobile).toBe(false);
    expect(mockState.drawerWidth).toBe(270);
    expect(mockState.messages).toEqual([]);
    expect(mockState.showAlert).toBe(false);
  });
});

describe('حالة سياق المظهر (ThemeContextState)', () => {
  it('يجب أن يحتوي على mode و toggleTheme', () => {
    const mockTheme: ThemeContextState = {
      mode: 'light',
      toggleTheme: () => {},
    };
    expect(mockTheme.mode).toBe('light');
    expect(typeof mockTheme.toggleTheme).toBe('function');
  });
});

describe('معلمات الصفحة الديناميكية (SlugPageParams)', () => {
  it('يجب أن يحتوي على params مع slug', async () => {
    const pageParams: SlugPageParams = {
      params: Promise.resolve({ slug: 'Simple-present' }),
    };
    const resolved = await pageParams.params;
    expect(resolved.slug).toBe('Simple-present');
  });
});
