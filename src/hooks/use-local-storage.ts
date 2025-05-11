"use client";

import { useState, useEffect, useCallback } from 'react';

function getSavedValue<T>(key: string, initialValue: T | (() => T)): T {
  if (typeof window === 'undefined') {
    return typeof initialValue === 'function'
      ? (initialValue as () => T)()
      : initialValue;
  }
  const savedValue = window.localStorage.getItem(key);
  if (savedValue !== null) {
    try {
      return JSON.parse(savedValue);
    } catch {
      // If parsing fails, return initialValue
      return typeof initialValue === 'function'
        ? (initialValue as () => T)()
        : initialValue;
    }
  }
  return typeof initialValue === 'function'
    ? (initialValue as () => T)()
    : initialValue;
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => getSavedValue(key, initialValue));

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error saving to localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}
