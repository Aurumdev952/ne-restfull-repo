import { z } from 'zod';

/**
 * Zod schema for validating a strong password between 8 and 16 characters.
 * A strong password is defined here as:
 * - At least 8 characters long.
 * - At most 16 characters long.
 * - Contains at least one uppercase letter.
 * - Contains at least one lowercase letter.
 * - Contains at least one digit.
 * - Contains at least one special character (non-alphanumeric).
 */
export const strongPasswordSchema = z.string()
  .min(8, {
    message: 'Password must be at least 8 characters long.'
  })
  .max(16, {
    message: 'Password must be at most 16 characters long.'
  })
  .regex(/[A-Z]/, {
    message: 'Password must contain at least one uppercase letter.'
  })
  .regex(/[a-z]/, {
    message: 'Password must contain at least one lowercase letter.'
  })
  .regex(/[0-9]/, {
    message: 'Password must contain at least one number.'
  })
  .regex(/[^a-zA-Z0-9]/, {
    message: 'Password must contain at least one special character (e.g., !@#$%^&*).',
  });

// Example of how to use this schema in another Zod object:
/*
const userAuthSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long."),
  password: strongPasswordSchema, // Apply the strong password validator here
});

// Example usage:
const validUser = {
  username: "myuser",
  password: "SecureP@ss1", // Valid password
};

const invalidUserShort = {
  username: "short",
  password: "Weak1!", // Too short
};

const invalidUserNoUpper = {
  username: "anotheruser",
  password: "weakpassword1!", // No uppercase
};

const invalidUserNoSpecial = {
  username: "testuser",
  password: "WeakPassword1", // No special character
};


try {
  userAuthSchema.parse(validUser);
  console.log("Valid user:", validUser);
} catch (e: any) {
  console.error("Validation error for valid user:", e.errors); // Should not happen
}

try {
  userAuthSchema.parse(invalidUserShort);
} catch (e: any) {
  console.error("Validation error for invalid short password:", e.errors);
}

try {
  userAuthSchema.parse(invalidUserNoUpper);
} catch (e: any) {
  console.error("Validation error for password with no uppercase:", e.errors);
}

try {
  userAuthSchema.parse(invalidUserNoSpecial);
} catch (e: any) {
  console.error("Validation error for password with no special character:", e.errors);
}
*/
