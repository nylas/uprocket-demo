import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// A function that takes a start date  and end date
// and returns a formatted string that represents the
// duration between the two dates.
// Example: Jan 1 at 12:00 PM - 1:00 PM
export function formatDuration(start: Date, end: Date) {
  return `${Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(start)} at ${Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
  }).format(start)} - ${Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "numeric",
  }).format(end)}`;
}

export function getDurationInMinutes(start: Date, end: Date) {
  return (end.getTime() - start.getTime()) / 60000;
}
