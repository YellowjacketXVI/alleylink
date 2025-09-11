import clsx, { ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(...inputs));
}

// Username validation utilities
export const USERNAME_RULES = {
  minLength: 3,
  maxLength: 30,
  pattern: /^[a-zA-Z0-9_-]+$/,
  reservedWords: ['admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'root', 'support', 'help', 'about', 'contact', 'terms', 'privacy', 'login', 'signup', 'dashboard', 'profile', 'settings', 'billing', 'account']
};

export interface UsernameValidationResult {
  isValid: boolean;
  error?: string;
}

export function validateUsername(username: string): UsernameValidationResult {
  if (!username || username.trim().length === 0) {
    return { isValid: false, error: 'Username is required' };
  }

  const trimmed = username.trim().toLowerCase();

  if (trimmed.length < USERNAME_RULES.minLength) {
    return { isValid: false, error: `Username must be at least ${USERNAME_RULES.minLength} characters long` };
  }

  if (trimmed.length > USERNAME_RULES.maxLength) {
    return { isValid: false, error: `Username must be no more than ${USERNAME_RULES.maxLength} characters long` };
  }

  if (!USERNAME_RULES.pattern.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, hyphens, and underscores' };
  }

  if (USERNAME_RULES.reservedWords.includes(trimmed)) {
    return { isValid: false, error: 'This username is reserved and cannot be used' };
  }

  // Check for consecutive special characters
  if (/[-_]{2,}/.test(trimmed)) {
    return { isValid: false, error: 'Username cannot contain consecutive hyphens or underscores' };
  }

  // Check if starts or ends with special characters
  if (/^[-_]|[-_]$/.test(trimmed)) {
    return { isValid: false, error: 'Username cannot start or end with hyphens or underscores' };
  }

  return { isValid: true };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
