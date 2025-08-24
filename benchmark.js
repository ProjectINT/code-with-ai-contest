// Simple micro-benchmark (best-effort; JS engines vary).
// Usage: npm run bench  (optionally BENCH_N=10000000 node benchmark.js)
'use strict';
const { generateTimestamp48 } = require('./timestamp.js');

const N = Number(process.env.BENCH_N || 5_000_000);
const samples = new Array(1000);
for (let i = 0; i < samples.length; i++) samples[i] = Date.now() + i;

function bench() {
  const t0 = performance.now ? performance.now() : Date.now();
  let x = 0;
  for (let i = 0; i < N; i++) {
    x ^= generateTimestamp48(samples[i % samples.length]).charCodeAt(7);
  }
  const t1 = performance.now ? performance.now() : Date.now();
  const ms = t1 - t0;
  const mops = (N / ms) * 1000;
  console.log(`Generated ${N.toLocaleString()} timestamps in ${ms.toFixed(2)} ms => ${mops.toFixed(2)} ops/sec`);
  // Prevent dead-code elim
  if (x === 42) console.log('x=42');
}

bench();
