import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNameInitials(fullName: string) {
  const names = fullName.split(' ').filter(Boolean)

  return names
    .map((name) => name.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export const capitalizeString = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
export const waitPromise = (seconds : number) => new Promise(resolve => { setTimeout(resolve, seconds * 1000) });