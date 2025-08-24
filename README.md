# timestamp48

Fast, zero-deps 48‑bit (UUIDv7‑style) timestamp encoder to **8‑char Base64URL**.

- **48‑bit big‑endian** milliseconds since Unix epoch
- **Base64URL** alphabet `A–Z a–z 0–9 - _`, **no padding**
- **8 chars** total (6 bytes → 8 base64 chars)
- Works in **Node, Deno, Bun, browsers** (no npm deps)
- Focused on **performance & maintainability**

## Install

```bash
# clone your repo and copy files, or use as a local module
```

## Usage

```js
const { generateTimestamp48 } = require('./timestamp'); // or ESM import

const id = generateTimestamp48();     // e.g. "BdXMD1ht"
const id2 = generateTimestamp48(0);   // "AAAAAAAA" (epoch)
```

## Why Base64URL?
- URL/filename safe (`-` and `_` instead of `+` and `/`)
- No padding (`=` removed)
- Lexicographically **ordered by time** because we encode **big‑endian**
  (great for time‑sortable keys)

## API
```ts
function generateTimestamp48(now?: number): string;
```

## Tests
```bash
npm test
```

## Benchmark (rough)
```bash
npm run bench             # BENCH_N=20000000 npm run bench for bigger runs
```

## License
MIT
