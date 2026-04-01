import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useState } from 'react';
import { useActionCycle } from '@/app/hooks/useActionCycle';

function TranslationFlowHarness() {
  const [value, setValue] = useState('');
  const hasInput = value.trim().length > 0;
  const { isLocked, isActionDisabled, beginSubmit, finishSubmit, resetCycle } = useActionCycle({
    hasInput,
  });

  const onCheck = () => {
    beginSubmit();
    finishSubmit(true);
  };

  const onNewSentence = () => {
    setValue('');
    resetCycle();
  };

  return (
    <div>
      <input
        aria-label="translation-input"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          resetCycle();
        }}
        disabled={isLocked}
      />
      <button aria-label="translation-check" onClick={onCheck} disabled={isActionDisabled}>
        تأكد من الترجمة
      </button>
      <button aria-label="new-sentence" onClick={onNewSentence}>
        أعطني جملة جديدة
      </button>
    </div>
  );
}

function ConversationFlowHarness() {
  const [hasRecording, setHasRecording] = useState(true);
  const { isLocked, isActionDisabled, beginSubmit, finishSubmit, resetCycle } = useActionCycle({
    hasInput: hasRecording,
  });

  const onConfirm = () => {
    beginSubmit();
    finishSubmit(true);
  };

  return (
    <div>
      <button aria-label="confirm-sentence" onClick={onConfirm} disabled={isActionDisabled}>
        تأكد من الجملة
      </button>
      <button
        aria-label="start-recording"
        onClick={() => setHasRecording(true)}
        disabled={isLocked}
      >
        بدء التسجيل
      </button>
      <audio aria-label="playback-control" controls />
      <button
        aria-label="reset-conversation"
        onClick={() => {
          resetCycle();
          setHasRecording(false);
        }}
      >
        reset
      </button>
    </div>
  );
}

describe('interaction state model disable/enable behavior', () => {
  it('translation flow keeps controls visible, locks after submit, and resets on new sentence', () => {
    render(<TranslationFlowHarness />);

    const input = screen.getByLabelText('translation-input');
    const checkButton = screen.getByLabelText('translation-check');
    const newSentenceButton = screen.getByLabelText('new-sentence');

    expect(checkButton).toBeVisible();
    expect(checkButton).toBeDisabled();
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();

    fireEvent.change(input, { target: { value: 'ترجمة مقترحة' } });
    expect(checkButton).toBeEnabled();
    expect(input).toHaveValue('ترجمة مقترحة');

    fireEvent.click(checkButton);
    expect(checkButton).toBeVisible();
    expect(checkButton).toBeDisabled();
    expect(input).toHaveValue('ترجمة مقترحة');
    expect(input).toBeDisabled();

    fireEvent.click(newSentenceButton);
    expect(input).toHaveValue('');
    expect(input).not.toBeDisabled();
    expect(checkButton).toBeVisible();
    expect(checkButton).toBeDisabled();
  });

  it('conversation flow disables confirm/start controls after submit while keeping playback available', () => {
    render(<ConversationFlowHarness />);

    const confirm = screen.getByLabelText('confirm-sentence');
    const startRecording = screen.getByLabelText('start-recording');
    const playback = screen.getByLabelText('playback-control');
    const reset = screen.getByLabelText('reset-conversation');

    expect(confirm).toBeEnabled();
    expect(startRecording).toBeEnabled();
    expect(playback).toBeInTheDocument();

    fireEvent.click(confirm);
    expect(confirm).toBeDisabled();
    expect(startRecording).toBeDisabled();
    expect(playback).toBeInTheDocument();

    fireEvent.click(reset);
    expect(confirm).toBeDisabled();
    expect(startRecording).toBeEnabled();
  });
});
