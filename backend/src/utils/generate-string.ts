/**
 * Options for generating a random string.
 */
interface GenerateRandomStringOptions {
  /**
   * The type of characters to include in the string.
   * 'digits': Includes only 0-9.
   * 'alphabets': Includes a-z and A-Z.
   * 'alphanumeric': Includes 0-9, a-z, and A-Z.
   * Defaults to 'digits'.
   */
  type?: "digits" | "alphabets" | "alphanumeric";
  /**
   * The character or string to use as a separator.
   * Defaults to '' (no separator).
   */
  separator?: string;
  /**
   * The interval at which to insert the separator.
   * Separators are inserted after every `separatorInterval` characters.
   * Requires `separator` to be provided and greater than 0.
   * Defaults to 0 (no separator interval).
   */
  separatorInterval?: number;
}

/**
 * Generates a random string of a specified length, with optional separators.
 *
 * @param length The desired length of the random part of the string (excluding separators).
 * @param options Optional configuration for the string generation.
 * @returns A randomly generated string.
 */
function generateRandomString(
  length: number,
  options?: GenerateRandomStringOptions
): string {
  // Apply default options
  const effectiveOptions: Required<GenerateRandomStringOptions> = {
    type: options?.type ?? "digits",
    separator: options?.separator ?? "",
    separatorInterval: options?.separatorInterval ?? 0,
  };

  // Validate length
  if (length <= 0) {
    return "";
  }

  // Determine the character set based on the type
  let characterSet: string;
  switch (effectiveOptions.type) {
    case "alphabets":
      characterSet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "alphanumeric":
      characterSet =
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      break;
    case "digits":
    default:
      characterSet = "0123456789";
      break;
  }

  let result = "";
  let generatedCharCount = 0; // Counts the number of random characters added (excluding separators)

  for (let i = 0; i < length; i++) {
    // Add separator if conditions are met:
    // 1. A separator string is provided.
    // 2. A valid interval is set (greater than 0).
    // 3. We are not adding the very first character (generatedCharCount > 0).
    // 4. The current character count is a multiple of the interval.
    if (
      effectiveOptions.separator &&
      effectiveOptions.separatorInterval > 0 &&
      generatedCharCount > 0 &&
      generatedCharCount % effectiveOptions.separatorInterval === 0
    ) {
      result += effectiveOptions.separator;
    }

    // Add a random character from the set
    const randomIndex = Math.floor(Math.random() * characterSet.length);
    result += characterSet[randomIndex];
    generatedCharCount++; // Increment the count of random characters added
  }

  return result;
}

// --- Examples ---

// 1. Generate 10 random digits
const digitsOnly = generateRandomString(10);
console.log("10 digits:", digitsOnly); // e.g., 5739102846

// 2. Generate 15 random digits with hyphen separator every 4 digits
const digitsWithSeparator = generateRandomString(15, {
  separator: "-",
  separatorInterval: 4,
});
console.log("15 digits with hyphen every 4:", digitsWithSeparator); // e.g., 8473-0192-5638-104

// 3. Generate 8 random alphabets (mixed case)
const alphabetsOnly = generateRandomString(8, {
  type: "alphabets",
});
console.log("8 alphabets:", alphabetsOnly); // e.g., pQrStUvW

// 4. Generate 20 random alphanumeric characters with space separator every 5 characters
const alphanumericWithSeparator = generateRandomString(20, {
  type: "alphanumeric",
  separator: " ",
  separatorInterval: 5,
});
console.log("20 alphanumeric with space every 5:", alphanumericWithSeparator); // e.g., Abc1D 2EfG3 hIjK4 LmN5p

// 5. Generate 5 alphanumeric characters (no separator)
const alphanumericNoSeparator = generateRandomString(5, {
  type: "alphanumeric",
});
console.log("5 alphanumeric:", alphanumericNoSeparator); // e.g., XyZ7q
