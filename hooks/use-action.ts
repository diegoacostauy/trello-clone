import { useState, useEffect, useCallback } from 'react';
import { ActionState, FieldErrors } from '@/lib/create-safe-action';

type Action<TInput, TOutput> = (data: TInput) => Promise<ActionState<TInput, TOutput>>;

interface UseActionOptions<TOutput> {
  onSuccess?: (data: TOutput) => void;
  onError?: (error: string) => void;
  onComplete?: () => void;
}

export const useAction = <TInput, TOutput>(
  action: Action<TInput, TOutput>,
  options: UseActionOptions<TOutput> = {}
) => {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<TInput> | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [data, setData] = useState<TOutput | undefined>(undefined);

  const execute = useCallback(async (data: TInput) => {
    setIsLoading(true);
    try {
      const result = await action(data);
      if (!result) return;

      if (result.fieldErrors) {
        setFieldErrors(result.fieldErrors);
      }

      if (result.error) {
        setError(result.error);
        options.onError?.(result.error);
      }

      if (result.data) {
        setData(result.data);
        options.onSuccess?.(result.data);
      }

    } finally {
      setIsLoading(false);
      options.onComplete?.();
    }
  }, [options, action]);

  return {
    execute,
    fieldErrors,
    error,
    data,
    isLoading
  }
}