# Codebase Structure

**Analysis Date:** 2026-06-09

## Directory Layout

```
brand-voice-artifact/
├── .github/
│   └── workflows/
│       ├── ci.yml          # Build, typecheck, pack, first-party-peer gate
│       └── release.yml     # Release workflow
├── skills/
│   └── brand-voice-matcher/
│       └── SKILL.md        # LLM classifier prompt for brand-voice documents
├── src/
│   └── index.ts            # SemanticArtifactManifest export (sole TS source)
├── .npmrc                  # npm/pnpm registry config
├── LICENSE                 # Apache-2.0
├── README.md               # Package documentation
├── package.json            # Package manifest + cinatra extension metadata
└── tsconfig.json           # Standalone TypeScript config (targets src/, emits to dist/)
```

## Directory Purposes

**`src/`:**
- Purpose: TypeScript source for the artifact extension.
- Contains: A single file (`index.ts`) exporting the `SemanticArtifactManifest` constant.
- Key files: `src/index.ts`

**`skills/`:**
- Purpose: Cinatra skill definitions consumed by the skill runner at runtime.
- Contains: One subdirectory per skill, each with a `SKILL.md` prompt file.
- Key files: `skills/brand-voice-matcher/SKILL.md`

**`.github/workflows/`:**
- Purpose: CI/CD automation.
- Contains: `ci.yml` (build gate) and `release.yml` (publish gate).
- Key files: `.github/workflows/ci.yml`

## Key File Locations

**Entry Points:**
- `src/index.ts`: TypeScript entry point; exports `brandVoiceArtifactManifest`.

**Configuration:**
- `package.json`: npm manifest; also the Cinatra machine-readable extension config under the `.cinatra` key.
- `tsconfig.json`: TypeScript compiler config; `rootDir: src`, `outDir: dist`, `module: ESNext`, strict mode.
- `.npmrc`: Registry/auth config for pnpm. Note existence only — never read contents.

**Skill Definitions:**
- `skills/brand-voice-matcher/SKILL.md`: LLM classifier system prompt with frontmatter metadata.

**CI:**
- `.github/workflows/ci.yml`: Enforces first-party peer shape, typechecks, packs. Key contract documented inline.

## Naming Conventions

**Files:**
- TypeScript source files: `camelCase.ts` (e.g., `index.ts`).
- Skill files: Always named `SKILL.md` (uppercase) inside a kebab-case skill directory.
- Workflow files: kebab-case `.yml` (e.g., `ci.yml`, `release.yml`).

**Directories:**
- Skill directories: kebab-case matching the skill name (e.g., `brand-voice-matcher`).
- Source directory: `src/` (standard).

**Exports:**
- The manifest constant uses camelCase with a descriptive suffix: `brandVoiceArtifactManifest`.

## Where to Add New Code

**New Skill (Matcher or otherwise):**
- Create a new subdirectory under `skills/` using kebab-case: `skills/<skill-name>/SKILL.md`.
- Register the skill reference in `src/index.ts` under `manifest.skills` and mirror the change in `package.json` under `cinatra.artifact.skills`.

**Updated Manifest Fields:**
- Edit `src/index.ts` — the `brandVoiceArtifactManifest` object.
- Mirror every change in `package.json`'s `cinatra.artifact` block in the same commit.

**TypeScript Utilities (if ever needed):**
- Place additional `.ts` files in `src/`. The `tsconfig.json` includes all of `src/**/*.ts`.

**Tests (if added):**
- Place alongside source as `src/*.test.ts` or in a top-level `tests/` directory.
- The CI step `corepack pnpm test --if-present` will pick up any `test` script added to `package.json`.

## Special Directories

**`dist/`:**
- Purpose: TypeScript compiler output (`tsc` emit).
- Generated: Yes.
- Committed: No (not present; generated at build time by the monorepo).

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents.
- Generated: Yes (by `/gsd-map-codebase`).
- Committed: Optional (project decision).

---

*Structure analysis: 2026-06-09*
