'use client';
import { useState, useEffect } from 'react';

type SetValue<T> = (newValue: T) => void;
type RemoveValue = () => void;

export function useLocalStorage<T>(key: string, initialValue?: T) {
  const isClient = typeof window !== 'undefined';

  const serialize = (value: T | undefined) => {
    if (value === undefined) return undefined;
    if (typeof value === 'string') return value;
    return JSON.stringify(value);
  };

  const deserialize = (value: string | null): T | undefined => {
    if (value === null) return initialValue;
    if (typeof initialValue === 'string') {
      return value as unknown as T;
    }
    try {
      return JSON.parse(value) as T;
    } catch {
      return initialValue;
    }
  };

  const [storedValue, setStoredValue] = useState<T | undefined>(
    isClient ? deserialize(window.localStorage.getItem(key)) : initialValue,
  );

  useEffect(() => {
    if (!isClient) return;

    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(deserialize(item));
      } else if (initialValue !== undefined) {
        const serialized = serialize(initialValue);
        if (serialized !== undefined) {
          window.localStorage.setItem(key, serialized);
        }
        setStoredValue(initialValue);
      }
    } catch {}
  }, [key, initialValue, isClient]);

  const setValue: SetValue<T> = (newValue) => {
    if (!isClient) return;
    try {
      const serialized = serialize(newValue);
      if (serialized !== undefined) {
        window.localStorage.setItem(key, serialized);
      }
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
