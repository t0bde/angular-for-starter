# Living Systems Lab

A small public teaching site, in English and German, where you edit a living grid and watch the local rule answer. No account, no install, no server.

- **Meadow Makers** (`/meadow`): a food-chain meadow of plants, plant eaters and predators. Paint cells, run or step days, open a seeded story, and tune species behavior.
- **Conway's Way of Life** (`/game-of-life`): Conway's Game of Life (B3/S23) with brushes, Methuselah seeds and an optional wrap-around edge.
- **How it works** (`/how-it-works`): the Life rules explained.
- **Impressum & Datenschutz** (`/impressum`): operator and privacy notice.

Built with Angular 22 (standalone components, signals, lazy routes), Vitest and ESLint.

## Design documents

| Document | What it covers |
| --- | --- |
| [`goal-and-requirements.md`](goal-and-requirements.md) | Goal, audience, capabilities and non-goals |
| [`architecture.md`](architecture.md) | Decisions, invariants and limitations |
| `src/app/**/SPEC.md` | Per-module rules (shell, i18n, meadow, game of life, how it works) |

Key rules to keep in mind: the two labs never import each other, each tick's rules live in that lab's engine (`*-engine.ts`), and every visitor string goes through `i18n` (English is the key set; the legal page is the exception).

## Development

Requires Node.js 22 and npm.

```bash
npm ci          # install dependencies
npm start       # dev server at http://localhost:4200/
npm test        # unit tests (Vitest); add -- --watch=false for a single run
npm run lint    # ESLint, zero warnings allowed
npm run build   # production build into dist/
```

There is no end-to-end test setup.

## Delivery workflow

Keep work outcome-led and specifications lightweight:

- Open an issue when work needs coordination. Describe the user problem, the observable outcome, and testable acceptance criteria; include constraints or non-goals when they matter.
- Keep implementation detail in the code and tests. Update the issue or documentation when the expected behavior changes.
- Use a pull request to explain the outcome, implementation trade-offs, and verification. Keep review focused on correctness and user impact rather than ceremony or status reporting.
- Pull requests and pushes to `main` run lint, unit tests, and a production build through the **Verify** workflow. Merge after those checks pass and review is complete.
- Ship when the change is ready; this repository does not currently configure automated deployment.

## Hosting

The site is a static single-page app. `vercel.json` rewrites unknown paths to `index.html` so deep links such as `/meadow` work on a reload. Any static host needs the same fallback.
