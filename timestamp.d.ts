// TypeScript declarations for the public API
/**
 * Generate an 8-character Base64URL string (48-bit UUIDv7-style timestamp).
 * @param now Optional millisecond timestamp to encode instead of Date.now().
 * @returns 8-char Base64URL string (no padding).
 */
export function generateTimestamp48(now?: number): string;
