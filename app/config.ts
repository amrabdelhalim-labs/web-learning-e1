import type { LessonItem } from './types';

/** Application name in Arabic */
export const APP_NAME = 'علمني';

/** Application name in English */
export const APP_NAME_EN = 'Teach Me';

/** Sidebar drawer width in pixels */
export const DRAWER_WIDTH = 270;

/** Maximum content width for main area */
export const MAX_CONTENT_WIDTH = 750;

/** LocalStorage key for theme mode */
export const THEME_STORAGE_KEY = 'theme-mode';

/** OpenAI model used for completions */
export const OPENAI_MODEL = 'gpt-4o-mini';

/** Available lessons/topics */
export const LESSONS: LessonItem[] = [
  { slug: 'Simple-present', nameAr: 'المضارع البسيط' },
  { slug: 'Simple-past', nameAr: 'الماضي البسيط' },
  { slug: 'Descriptive-adjectives-and-adjectives', nameAr: 'الصفات والصفات الموصوفة' },
  { slug: 'Comparative-form', nameAr: 'صيغة المقارنة' },
  { slug: 'plural-nouns', nameAr: 'الأسماء الجمع' },
  { slug: 'Countable-and-uncountable-nouns', nameAr: 'الأسماء المعدودة وغير المعدودة' },
  { slug: 'personal-pronouns', nameAr: 'الضمائر الشخصية' },
  { slug: 'Adverbs', nameAr: 'الظروف' },
  { slug: 'Complex-sentences', nameAr: 'الجمل المعقدة' },
];

/** Lesson section definitions */
export const LESSON_SECTIONS = {
  lecture: 'شرح الدرس',
  question: 'أسئلة',
  conversation: 'محادثة',
  translate: 'ترجمة',
} as const;

/** Loading text arrays for different sections */
export const LOADING_TEXTS = {
  home: [
    'ستحصل على الإجابة في غضون لحظات قليلة.',
    'إجابتك ستكون متاحة لك في وقت قريب جدًا.',
    'ستتلقى الإجابة الخاصة بك في غضون لحظات.',
    'ستحصل على الإجابة في وقت قصير جدًا.',
    'ستكون لديك الإجابة في وقت قريب للغاية.',
    'إجابتك ستكون لديك خلال لحظات.',
  ],
  lecture: [
    'نحضر لك درسًا شيقًا.',
    'قريبًا ستبدأ الدرس الممتع، استعد!',
    'درس شيق قيد الإعداد، يرجى الانتظار.',
    'جارٍ تحضير درس مثير، قليلًا من الصبر.',
    'استعد لدرس مميز، سيبدأ قريبًا.',
    'درس شيق قادم، استعد للاستفادة.',
    'نحن في طور إعداد درس مثير، انتظر لحظة.',
  ],
  question: [
    'قريبًا سيتم كشف الستار عن السؤال الشيق، استعد للتحدي!',
    'هل أنت مستعد لإظهار مهاراتك؟ سنكشف عن السؤال قريبًا!',
    'التحدي قادم! انتظر لرؤية السؤال والتفوق في حله.',
    'استعد لاختبار قوتك العقلية، سنقدم لك السؤال قريبًا.',
    'نحن هنا لتقديم لك تحديًا جديدًا، استمتع بانتظار السؤال!',
    'استعد لرحلة تفكير مثيرة، سنعرض السؤال في وقت قريب.',
    'سنكشف النقاب عن اللغز قريبًا، حان وقت إثبات قوتك.',
    'انتظر لحظات قليلة، سنعرض السؤال وستبدأ المتعة!',
    'حان وقت اختبار قدراتك، استعد لحل السؤال.',
  ],
  conversation: [
    'القراءة توسّع مفرداتك وتعزز قوة لغتك.',
    'كل جملة تعزز فهمك لبنية اللغة واستخدام الكلمات.',
    'من خلال القراءة، تصبح أكثر دقة في التعبير عن أفكارك.',
    'اكتشف معاني جديدة واستخدمها لتحسين تواصلك اللغوي.',
    'قراءة الجمل تساعدك في تطوير مهاراتك في القواعد اللغوية.',
    'استمتع بالتعرف على أساليب متنوعة للتعبير من خلال القراءة.',
    'كل جملة تمنحك نموًا في فهمك للغة واستخدامها بثقة.',
  ],
  translate: [
    'الصبر مفتاح الإتقان، انتظر قليلاً وستحصل على جملة لترجمتها.',
    'استمتع بلحظات الانتظار بتحديد معنى هذه الجملة!',
    'قريبًا ستحصل على جملة مثيرة للترجمة، استعد!',
    'الترجمة تحتاج إلى تركيز، انتظر لرؤية الجملة وترجمها بدقة.',
    'التفكير العميق يحتاج للوقت، لننتظر سويًا للحصول على جملة لترجمتها.',
    'الترجمة فن يتطلب صبرًا، سنقدم لك جملة لتحدي ترجمتها.',
    'المتعة في تحديد المعاني، انتظر لرؤية الجملة وبدأ الترجمة.',
  ],
} as const;

/** Get a random loading text for a given section */
export function getRandomLoadingText(section: keyof typeof LOADING_TEXTS): string {
  const texts = LOADING_TEXTS[section];
  return texts[Math.floor(Math.random() * texts.length)];
}
