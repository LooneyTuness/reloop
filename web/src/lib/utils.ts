import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isRequired(value: unknown, errorMessage: string): asserts value {
  if (value === null || value === undefined) {
    throw new Error(errorMessage);
  }
}
