// Types for the علمني (Teach Me) application

/** OpenAI chat message role */
export type MessageRole = 'user' | 'assistant' | 'system';

/** Chat message structure */
export interface ChatMessage {
  role: MessageRole;
  content: string;
}

/** API response wrapper */
export interface ApiResponse<T = Record<string, unknown>> {
  data: T;
  status: number;
}

/** Chat completion response from API */
export interface ChatCompletionData {
  role: MessageRole;
  content: string;
}

/** Text completion response from API */
export interface TextCompletionData {
  text: string;
}

/** Transcription response from API */
export interface TranscriptionData {
  text: string;
}

/** API error response */
export interface ApiErrorData {
  error: string;
}

/** Theme mode */
export type ThemeMode = 'light' | 'dark';

/** Lesson/lecture definition */
export interface LessonItem {
  slug: string;
  nameAr: string;
}

/** Lesson sub-section types */
export type LessonSection = 'lecture' | 'question' | 'conversation' | 'translate';

/** Lesson sub-section definition */
export interface LessonSectionItem {
  key: LessonSection;
  nameAr: string;
  icon: string;
}

/** App context state */
export interface AppContextState {
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  drawerWidth: number;
  messageValue: string;
  setMessageValue: (value: string) => void;
  contextPreviousMessage: ChatMessage[];
  setContextPreviousMessage: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  handleChatResponse: (response: ApiResponse<ChatCompletionData>, userContent: string) => boolean;
  clearMessages: () => void;
  showAlert: boolean;
  setShowAlert: (show: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  textButton: string;
  setTextButton: (text: string) => void;
  showFooterButton: boolean;
  setShowFooterButton: (show: boolean) => void;
}

/** Theme context state */
export interface ThemeContextState {
  mode: ThemeMode;
  toggleTheme: () => void;
}

/** Page params for dynamic routes */
export interface SlugPageParams {
  params: Promise<{ slug: string }>;
}
