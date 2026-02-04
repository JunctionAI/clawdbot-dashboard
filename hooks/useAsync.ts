'use client';

import { useState, useCallback } from 'react';
import { useToast } from '@/components/ui/Toast';

export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';

interface AsyncState<T> {
  data: T | null;
  status: AsyncStatus;
  error: string | null;
}

interface UseAsyncOptions {
  // Toast messages for success/error
  successMessage?: string;
  errorMessage?: string;
  // Show toasts automatically
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  // Reset to idle after success (ms)
  resetDelay?: number;
}

interface UseAsyncReturn<T, Args extends unknown[]> extends AsyncState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isIdle: boolean;
}

/**
 * Hook for handling async operations with loading, success, and error states.
 * Automatically shows toast notifications and handles state management.
 * 
 * @example
 * const { execute, isLoading, isError, error } = useAsync(
 *   async (skillId: string, active: boolean) => {
 *     const res = await fetch(`/api/skills/${skillId}`, {
 *       method: 'PATCH',
 *       body: JSON.stringify({ active })
 *     });
 *     if (!res.ok) throw new Error('Failed to update skill');
 *     return res.json();
 *   },
 *   {
 *     successMessage: 'Skill updated!',
 *     showSuccessToast: true,
 *     showErrorToast: true,
 *   }
 * );
 */
export function useAsync<T, Args extends unknown[] = []>(
  asyncFunction: (...args: Args) => Promise<T>,
  options: UseAsyncOptions = {}
): UseAsyncReturn<T, Args> {
  const {
    successMessage = 'Operation completed',
    errorMessage,
    showSuccessToast = true,
    showErrorToast = true,
    resetDelay = 3000,
  } = options;

  const { addToast } = useToast();
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ data: null, status: 'loading', error: null });

      try {
        const result = await asyncFunction(...args);
        setState({ data: result, status: 'success', error: null });

        if (showSuccessToast) {
          addToast({
            type: 'success',
            title: 'Success',
            message: successMessage,
          });
        }

        // Reset to idle after delay
        if (resetDelay > 0) {
          setTimeout(() => {
            setState((prev) => ({ ...prev, status: 'idle' }));
          }, resetDelay);
        }

        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setState({ data: null, status: 'error', error: message });

        if (showErrorToast) {
          addToast({
            type: 'error',
            title: 'Error',
            message: errorMessage || message,
          });
        }

        return null;
      }
    },
    [asyncFunction, addToast, successMessage, errorMessage, showSuccessToast, showErrorToast, resetDelay]
  );

  const reset = useCallback(() => {
    setState({ data: null, status: 'idle', error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  };
}

/**
 * Hook for handling form submissions with loading/success/error states.
 */
export function useFormSubmit<T>(
  submitFn: (data: T) => Promise<void>,
  options: UseAsyncOptions = {}
) {
  return useAsync(submitFn, {
    successMessage: 'Form submitted successfully',
    ...options,
  });
}

/**
 * Hook for handling mutations (create/update/delete) with optimistic updates.
 */
export function useMutation<T, Args extends unknown[] = []>(
  mutationFn: (...args: Args) => Promise<T>,
  options: UseAsyncOptions & {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {}
) {
  const { onSuccess, onError, ...asyncOptions } = options;
  const { addToast } = useToast();

  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    status: 'idle',
    error: null,
  });

  const mutate = useCallback(
    async (...args: Args): Promise<T | null> => {
      setState({ data: null, status: 'loading', error: null });

      try {
        const result = await mutationFn(...args);
        setState({ data: result, status: 'success', error: null });

        if (asyncOptions.showSuccessToast !== false) {
          addToast({
            type: 'success',
            title: 'Success',
            message: asyncOptions.successMessage || 'Operation completed',
          });
        }

        onSuccess?.(result);
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred';
        setState({ data: null, status: 'error', error: message });

        if (asyncOptions.showErrorToast !== false) {
          addToast({
            type: 'error',
            title: 'Error',
            message: asyncOptions.errorMessage || message,
          });
        }

        onError?.(message);
        return null;
      }
    },
    [mutationFn, addToast, asyncOptions, onSuccess, onError]
  );

  const reset = useCallback(() => {
    setState({ data: null, status: 'idle', error: null });
  }, []);

  return {
    ...state,
    mutate,
    reset,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
  };
}
