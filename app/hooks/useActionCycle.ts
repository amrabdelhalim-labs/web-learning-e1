'use client';

import { useCallback, useMemo, useState } from 'react';

interface UseActionCycleOptions {
  hasInput: boolean;
}

export function useActionCycle({ hasInput }: UseActionCycleOptions) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const beginSubmit = useCallback(() => {
    setIsSubmitting(true);
  }, []);

  const finishSubmit = useCallback((lockAfterSubmit: boolean) => {
    setIsSubmitting(false);
    setIsLocked(lockAfterSubmit);
  }, []);

  const resetCycle = useCallback(() => {
    setIsSubmitting(false);
    setIsLocked(false);
  }, []);

  const isActionDisabled = useMemo(
    () => !hasInput || isSubmitting || isLocked,
    [hasInput, isSubmitting, isLocked]
  );

  return {
    isSubmitting,
    isLocked,
    isActionDisabled,
    beginSubmit,
    finishSubmit,
    resetCycle,
  };
}
