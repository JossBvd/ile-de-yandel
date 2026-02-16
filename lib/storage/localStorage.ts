'use client';

import { STORAGE_KEY_HINTS } from '@/lib/constants';
import { logError, logWarn } from '@/lib/utils/logger';

function clearOldData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_HINTS);
  } catch (error) {
    logError('Error clearing old data:', error);
  }
}

export function getFromLocalStorage<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    logError(`Error reading from localStorage key "${key}":`, error);
    return null;
  }
}

export function setToLocalStorage<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    if (error instanceof DOMException && error.code === 22) {
      logWarn('LocalStorage quota exceeded, attempting to clear old data');
      clearOldData();
      
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch (retryError) {
        logError(`Error writing to localStorage key "${key}" after cleanup:`, retryError);
        return false;
      }
    }
    logError(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
}

export function removeFromLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    logError(`Error removing from localStorage key "${key}":`, error);
  }
}
