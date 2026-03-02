'use client';

import { createContext, useState, useCallback, type ReactNode } from 'react';
import type { AppContextState, ChatMessage, ApiResponse, ChatCompletionData } from '@/app/types';
import { DRAWER_WIDTH } from '@/app/config';

export const AppContext = createContext<AppContextState | null>(null);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [openMobile, setOpenMobile] = useState(false);
  const [messageValue, setMessageValue] = useState('');
  const [contextPreviousMessage, setContextPreviousMessage] = useState<ChatMessage[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [textButton, setTextButton] = useState('');
  const [showFooterButton, setShowFooterButton] = useState(false);

  const handleChatResponse = useCallback(
    (response: ApiResponse<ChatCompletionData>, userContent: string): boolean => {
      if (response?.status === 200) {
        const userMessage: ChatMessage = {
          role: 'user',
          content: userContent,
        };
        const assistantMessage: ChatMessage = {
          role: response.data.role,
          content: response.data.content,
        };

        setMessages((prev) => [...prev, userMessage, assistantMessage]);
        setContextPreviousMessage((prev) => [...prev, userMessage, assistantMessage]);
        return true;
      }

      setShowAlert(true);
      setErrorMessage((response?.data as unknown as { error?: string })?.error || 'حدث خطأ');
      return false;
    },
    []
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setContextPreviousMessage([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        openMobile,
        setOpenMobile,
        drawerWidth: DRAWER_WIDTH,
        messageValue,
        setMessageValue,
        contextPreviousMessage,
        setContextPreviousMessage,
        messages,
        setMessages,
        handleChatResponse,
        clearMessages,
        showAlert,
        setShowAlert,
        errorMessage,
        setErrorMessage,
        textButton,
        setTextButton,
        showFooterButton,
        setShowFooterButton,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
