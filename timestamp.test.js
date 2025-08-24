// Tests for timestamp48
'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { generateTimestamp48, _msTo48be, _encode48ToBase64URL } = require('./timestamp.js');

function nodeBase64Url(bytes) {
  return Buffer.from(bytes).toString('base64url');
}

describe('timestamp48', () => {
  test('encodes 0 -> "AAAAAAAA"', () => {
    const s = generateTimestamp48(0);
    assert.equal(s, 'AAAAAAAA');
  });

  test('encodes 1 -> "AAAAAAAB"', () => {
    const s = generateTimestamp48(1);
    assert.equal(s, 'AAAAAAAB');
  });

  test('matches Node Buffer base64url for random samples', () => {
    for (let i = 0; i < 1000; i++) {
      const x = Math.floor(Math.random() * 2 ** 40); // stay well under 48 bits
      const bytes = _msTo48be(x);
      const got = _encode48ToBase64URL(bytes);
      const exp = nodeBase64Url(bytes);
      assert.equal(got, exp, `mismatch at ${x}`);
    }
  });

  test('monotonicity for ascending timestamps (lexicographic)', () => {
    const N = 5000;
    let prev = generateTimestamp48(0);
    for (let i = 1; i < N; i++) {
      const cur = generateTimestamp48(i);
      assert.ok(cur > prev, `not monotonic at i=${i}`);
      prev = cur;
    }
  });

  test('real now() emits 8 chars', () => {
    const s = generateTimestamp48();
    assert.equal(s.length, 8);
    // Ensure characters are in Base64URL alphabet
    assert.match(s, /^[A-Za-z0-9\-_]{8}$/);
  });
});
