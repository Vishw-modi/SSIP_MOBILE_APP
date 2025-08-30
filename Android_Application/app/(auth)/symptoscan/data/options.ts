import { type DropdownItem } from "@/ui/dropdown";

// Generic option lists shared by multiple screens.

export const MEDICAL_CONDITIONS = [
  "Diabetes",
  "Hypertension",
  "Asthma",
  "Heart Disease",
  "Thyroid Disorder",
  "Kidney Disease",
  "Liver Disease",
  "Cancer",
  "Arthritis",
  "Depression",
  "Anxiety",
  "Other",
];

export const GENDER_OPTIONS = ["Male", "Female", "Other"] as const;

export const EXERCISE_OPTIONS: DropdownItem[] = [
  { label: "Rarely (0-1 days/week)", value: "rarely (0-1 days/week)" },
  { label: "Light (2-3 days/week)", value: "light (2-3 days/week)" },
  { label: "Moderate (3-4 days/week)", value: "moderate (3-4 days/week)" },
  { label: "Active (5-6 days/week)", value: "active (5-6 days/week)" },
  { label: "Intense (Daily)", value: "intense (Daily)" },
];

export const SLEEP_OPTIONS: DropdownItem[] = [
  { label: "Poor (≤4 hours/night)", value: "poor (≤4 hours/night)" },
  { label: "Fair (5-6 hours/night)", value: "fair (5-6 hours/night)" },
  { label: "Good (7-8 hours/night)", value: "good (7-8 hours/night)" },
  { label: "Excellent (≥9 hours/night)", value: "excellent (≥9 hours/night)" },
];

export const DIET_OPTIONS: DropdownItem[] = [
  { label: "Balanced", value: "balanced" },
  { label: "Low-carb", value: "low-carb" },
  { label: "Low-fat", value: "low-fat" },
  { label: "High-protein", value: "high-protein" },
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Keto", value: "keto" },
  { label: "Other", value: "other" },
];
