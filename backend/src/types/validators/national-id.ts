import { z } from "zod";

/**
 * Zod schema for validating Rwandan National ID numbers.
 * Rwandan National IDs are typically 16 digits long and consist only of numbers.
 */
export const rwandaNationalIdSchema = z
  .string()
  .trim() // Remove leading/trailing whitespace
  .length(16, {
    message: "Rwandan National ID must be exactly 16 characters long.",
  })
  .regex(/^\d{16}$/, {
    message: "Rwandan National ID must contain only digits (0-9).",
  });

// Example of how to use this schema in another Zod object:
/*
const personSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  nationalId: rwandaNationalIdSchema, // Apply the custom validator here
  dateOfBirth: z.string().optional(), // You might want a more specific date schema
});

// Example usage:
const validPerson = {
  firstName: "Alice",
  lastName: "Mutoni",
  nationalId: "1199012345678901", // Example of a valid 16-digit number
  dateOfBirth: "1990-01-01"
};

const invalidPersonLength = {
  firstName: "Bob",
  lastName: "Kamana",
  nationalId: "123456789012345", // Too short
};

const invalidPersonChars = {
  firstName: "Charlie",
  lastName: "Dushimimana",
  nationalId: "119901234567890A", // Contains a non-digit character
};


try {
  personSchema.parse(validPerson);
  console.log("Valid person:", validPerson);
} catch (e: any) {
  console.error("Validation error for valid person:", e.errors); // Should not happen
}

try {
  personSchema.parse(invalidPersonLength);
} catch (e: any) {
  console.error("Validation error for invalid length person:", e.errors);
}

try {
  personSchema.parse(invalidPersonChars);
} catch (e: any) {
  console.error("Validation error for invalid characters person:", e.errors);
}
*/
