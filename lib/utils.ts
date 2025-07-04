import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('uk-UA', {
    year: 'numeric',
    day:"2-digit",
    month: "2-digit",
    
  }).replaceAll("/", ".");
}