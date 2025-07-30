import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to format field names
export function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, " "); // Replace underscores with spaces
}

// Helper function to format field values
export function formatFieldValue(key: string, value: any): string {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  // Format specific fields
  switch (key.toLowerCase()) {
    case "salary":
      return typeof value === "number"
        ? `$${value.toLocaleString()}`
        : value.toString();
    case "gender":
      return (
        value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
      );
    case "id":
      return value.toString();
    default:
      return value.toString();
  }
}