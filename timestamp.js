// Fast 48-bit (UUIDv7-style) timestamp encoded as 8-char Base64URL
// Runtime: Any modern JS (Node, Deno, Bun, browsers). No external deps.
//
// Public API:
//   - generateTimestamp48(now?: number): string  -> 8 chars Base64URL
//   - _encode48ToBase64URL(bytes: Uint8Array): string  (exported for tests)
//
// Encoding details:
//   - Take 48-bit big-endian milliseconds since Unix epoch (Date.now()).
//   - Convert 6 bytes -> 8 Base64URL chars (no padding).
//   - Alphabet: A–Z a–z 0–9 - _
//
'use strict';

/** Precomputed Base64URL alphabet as a char array for speed. */
const ALPHABET = (() => {
  const s = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  const a = new Array(64);
  for (let i = 0; i < 64; i++) a[i] = s[i];
  return a;
})();

/**
 * Encode 6 bytes into 8 Base64URL characters.
 * Expects `bytes.length === 6`. Does not allocate intermediate arrays.
 * @param {Uint8Array} bytes
 * @returns {string} 8-char Base64URL
 */
function _encode48ToBase64URL(bytes) {
  // 6 bytes -> 8 sextets
  const b0 = bytes[0] | 0;
  const b1 = bytes[1] | 0;
  const b2 = bytes[2] | 0;
  const b3 = bytes[3] | 0;
  const b4 = bytes[4] | 0;
  const b5 = bytes[5] | 0;

  const c0 = b0 >>> 2;
  const c1 = ((b0 & 0x03) << 4) | (b1 >>> 4);
  const c2 = ((b1 & 0x0F) << 2) | (b2 >>> 6);
  const c3 = b2 & 0x3F;
  const c4 = b3 >>> 2;
  const c5 = ((b3 & 0x03) << 4) | (b4 >>> 4);
  const c6 = ((b4 & 0x0F) << 2) | (b5 >>> 6);
  const c7 = b5 & 0x3F;

  // Build string directly; concatenation of 8 small strings is very fast in JS engines
  return ALPHABET[c0] + ALPHABET[c1] + ALPHABET[c2] + ALPHABET[c3] +
         ALPHABET[c4] + ALPHABET[c5] + ALPHABET[c6] + ALPHABET[c7];
}

/**
 * Convert a millisecond timestamp (Number) into big-endian 6 bytes.
 * @param {number} ms Milliseconds since Unix epoch. Will be truncated to 48 bits.
 * @returns {Uint8Array} length 6
 */
function _msTo48be(ms) {
  // Ensure finite integer
  if (!Number.isFinite(ms)) ms = 0;
  ms = Math.floor(ms);

  // Split into hi (upper 16 bits) and lo (lower 32 bits) to avoid 32-bit shift issues
  const hi = Math.floor(ms / 0x100000000); // ms >>> 32 (but safe for JS)
  const lo = ms >>> 0;

  const bytes = new Uint8Array(6);
  bytes[0] = (hi >>> 8) & 0xFF;
  bytes[1] = (hi       ) & 0xFF;
  bytes[2] = (lo >>> 24) & 0xFF;
  bytes[3] = (lo >>> 16) & 0xFF;
  bytes[4] = (lo >>>  8) & 0xFF;
  bytes[5] = (lo       ) & 0xFF;
  return bytes;
}

/**
 * Generate an 8-character Base64URL string from the current time (or provided `now`).
 * This is the public function you should call.
 * @param {number} [now] Optional millisecond timestamp. Defaults to Date.now().
 * @returns {string} 8-char Base64URL string
 */
function generateTimestamp48(now) {
  const ms = now === undefined ? Date.now() : now;
  const bytes = _msTo48be(ms);
  return _encode48ToBase64URL(bytes);
}

module.exports = {
  generateTimestamp48,
  _encode48ToBase64URL,
  _msTo48be,
};
