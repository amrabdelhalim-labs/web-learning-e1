import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import React from 'react';
import { AppContext } from '@/app/context/AppContext';
import { useAppContext } from '@/app/hooks/useAppContext';
import type { AppContextState } from '@/app/types';

describe('useAppContext()', () => {
  const mockAppContext: AppContextState = {
    openMobile: false,
    setOpenMobile: () => {},
    drawerWidth: 270,
    messageValue: '',
    setMessageValue: () => {},
    contextPreviousMessage: [],
    setContextPreviousMessage: () => {},
    messages: [],
    setMessages: () => {},
    handleChatResponse: () => true,
    clearMessages: () => {},
    showAlert: false,
    setShowAlert: () => {},
    errorMessage: '',
    setErrorMessage: () => {},
    textButton: 'إرسال',
    setTextButton: () => {},
    showFooterButton: true,
    setShowFooterButton: () => {},
  };

  const wrapper = ({ children }: { children: React.ReactNode }) =>
    React.createElement(AppContext.Provider, { value: mockAppContext }, children);

  it('يجب أن يعيد جميع خصائص سياق التطبيق', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(result.current.openMobile).toBe(false);
    expect(result.current.drawerWidth).toBe(270);
    expect(result.current.messageValue).toBe('');
    expect(result.current.messages).toEqual([]);
    expect(result.current.showAlert).toBe(false);
    expect(result.current.errorMessage).toBe('');
    expect(result.current.textButton).toBe('إرسال');
    expect(result.current.showFooterButton).toBe(true);
  });

  it('يجب أن تكون جميع الدوال متاحة', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });

    expect(typeof result.current.setOpenMobile).toBe('function');
    expect(typeof result.current.setMessageValue).toBe('function');
    expect(typeof result.current.setContextPreviousMessage).toBe('function');
    expect(typeof result.current.setMessages).toBe('function');
    expect(typeof result.current.handleChatResponse).toBe('function');
    expect(typeof result.current.clearMessages).toBe('function');
    expect(typeof result.current.setShowAlert).toBe('function');
    expect(typeof result.current.setErrorMessage).toBe('function');
    expect(typeof result.current.setTextButton).toBe('function');
    expect(typeof result.current.setShowFooterButton).toBe('function');
  });

  it('يجب أن يرمي خطأ خارج AppProvider', () => {
    expect(() => {
      renderHook(() => useAppContext());
    }).toThrow('useAppContext must be used within an AppProvider');
  });

  it('يجب أن تكون الرسائل السابقة مصفوفة فارغة بشكل افتراضي', () => {
    const { result } = renderHook(() => useAppContext(), { wrapper });
    expect(result.current.contextPreviousMessage).toEqual([]);
    expect(Array.isArray(result.current.contextPreviousMessage)).toBe(true);
  });
});
