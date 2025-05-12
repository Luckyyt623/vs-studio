
"use client";

import { useState, useEffect } from 'react';

// Helper to resolve initialValue if it's a function
const resolveInitialValue = <T>(initialValueProp: T | (() => T)): T => {
  return initialValueProp instanceof Function ? initialValueProp() : initialValueProp;
};

export function useLocalStorage<T>(
  key: string,
  initialValueProp: T | (() => T)
): [T, React.Dispatch<React.SetStateAction<T>>] {
  // Step 1: Initialize state with the resolved initialValueProp.
  // This ensures server and client start with the same deterministic value.
  const [value, setValue] = useState<T>(() => resolveInitialValue(initialValueProp));

  // Step 2: useEffect to read from localStorage only on the client after the initial mount.
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const item = window.localStorage.getItem(key);
    if (item !== null) { // Check for null explicitly, empty string is a valid stored value
      try {
        const parsedItem = JSON.parse(item);
        setValue(parsedItem);
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        // Optionally fallback to initialValueProp if parsing fails
        // setValue(resolveInitialValue(initialValueProp));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]); // Only depends on `key`. initialValueProp is for first render state.

  // Step 3: useEffect to write to localStorage when value changes (client-side only).
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
