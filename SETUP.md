# SETUP

Exact environment used to generate these files (you can reproduce on your side):

- OS: Linux 4.4.0 (x86_64)
- CPU: Unknown / Cores: 56
- RAM: Not queried
- Node.js: >= 18 (tested with 20+)
- npm: comes with Node
- No Node flags required

### Steps
1. Ensure Node >= 18: `node -v`
2. Run tests: `npm test`
3. Run benchmark: `npm run bench`

Env vars:
- `BENCH_N` — number of iterations for benchmark (default 5,000,000)
