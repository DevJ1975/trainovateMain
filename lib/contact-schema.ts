import { z } from "zod";

export const interests = [
  "soteria-platform",
  "training-programs",
  "federal-teaming",
  "partnership",
  "other",
] as const;

export const industries = [
  "manufacturing",
  "logistics",
  "aviation",
  "energy",
  "cannabis",
  "food-processing",
  "federal-dod",
  "federal-va",
  "other",
] as const;

export const contactSchema = z.object({
  name: z.string().min(2, "Name is required").max(120),
  org: z.string().min(2, "Organization is required").max(160),
  role: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Valid email required").max(200),
  industry: z.enum(industries).optional(),
  interests: z.array(z.enum(interests)).min(1, "Select at least one interest").max(5),
  federal: z.boolean().optional(),
  message: z.string().min(10, "Tell us a little more").max(4000),
  // Honeypot — must be empty
  website: z.string().max(0).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
