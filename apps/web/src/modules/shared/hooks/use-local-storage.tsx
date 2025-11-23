'use client';
import { useState, useEffect } from 'react';

type SetValue<T> = (newValue: T) => void;
type RemoveValue = () => void;

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const isClient = typeof window !== 'undefined';

  const [storedValue, setStoredValue] = useState<T | undefined>(
    isClient
      ? (() => {
          try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
          } catch {
            return initialValue;
          }
        })()
      : initialValue,
  );

  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) { setStoredValue(JSON.parse(item)); }
      else if (initialValue !== undefined) {
        window.localStorage.setItem(key, JSON.stringify(initialValue));
        setStoredValue(initialValue);
      }
    } catch {}
  }, [key, initialValue, isClient]);

  const setValue: SetValue<T> = (newValue) => {
    if (!isClient) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(newValue));
      setStoredValue(newValue);
    } catch {}
  };

  const removeValue: RemoveValue = () => {
    if (!isClient) return;
    try {
      window.localStorage.removeItem(key);
      setStoredValue(undefined);
    } catch {}
  };

  return { value: storedValue, setValue, removeValue };
}
