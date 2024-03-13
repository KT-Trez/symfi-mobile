import { useEffect, useState } from 'react';
import useTimeout, { useTimeoutV2 } from './useTimeout';

/**
 * @deprecated
 */
export default function useDebounce(cb: () => void, delay: number, dependencies: any[]) {
  const { clear, reset } = useTimeout(cb, delay);

  useEffect(clear, []);

  useEffect(reset, [...dependencies, reset]);
}

export const useDebounceV2 = (callback: () => void, delay: number, dependencies: unknown[]) => {
  const { clear, reset } = useTimeoutV2(callback, delay);

  useEffect(clear, []);

  useEffect(reset, [...dependencies, reset]);
};

export const useConstDebounce = <T>(variable: T, delay: number) => {
  const [debouncedVariable, setDebouncedVariable] = useState(variable);
  const { clear, reset } = useTimeoutV2(() => setDebouncedVariable(variable), delay);

  useEffect(() => {
    if (!variable) return;

    clear();
    reset();
  }, [variable]);

  return debouncedVariable;
};
