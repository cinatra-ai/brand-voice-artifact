# Coding Conventions

**Analysis Date:** 2026-06-09

## Overview

This is a minimal Cinatra artifact extension repo (source mirror). It contains a single TypeScript source file (`src/index.ts`) and a SKILL.md prompt file. The conventions below reflect the patterns found in this repo and the broader Cinatra extension extraction model.

## Naming Patterns

**Files:**
- TypeScript source files use camelCase: `src/index.ts`
- Skill prompt files use kebab-case directory names: `skills/brand-voice-matcher/SKILL.md`
- Config files follow tool conventions: `tsconfig.json`, `package.json`

**Exported constants:**
- Named exports use camelCase with a descriptive, domain-prefixed name: `brandVoiceArtifactManifest`

**Variables:**
- Local variables use camelCase

**Types:**
- Imported types use PascalCase (e.g., `SemanticArtifactManifest` from `@cinatra-ai/sdk-extensions`)
- `import type` syntax is used for type-only imports (enforced by `verbatimModuleSyntax`)

**Package names:**
- Scoped under `@cinatra-ai/` namespace
- Kebab-case: `@cinatra-ai/brand-voice-artifact`

**Skill identifiers:**
- Namespaced as `<package-name>:<skill-name>`, e.g., `@cinatra-ai/brand-voice-artifact:brand-voice-matcher`

## Code Style

**Formatting:**
- No formatter config file detected (no `.prettierrc`, `biome.json`, or `eslint.config.*` present)
- `.npmrc` present — notes existence only, contents not read

**TypeScript:**
- `strict: true` in `tsconfig.json`
- `noImplicitAny: false` — implicit any is allowed despite strict mode
- `verbatimModuleSyntax: true` — requires explicit `import type` for type-only imports
- `isolatedModules: true` — each file must be independently transpilable
- Target: `ES2023`, module: `ESNext`, moduleResolution: `bundler`
- `declaration: true` and `declarationMap: true` — type declarations are emitted

**Module system:**
- ESM-only (`"type": "module"` in `package.json`)
- No CommonJS

## Import Organization

**Order:**
1. Type imports first (`import type { ... }`) when importing from peer dependencies
2. No runtime imports detected in `src/index.ts`

**Path Aliases:**
- None detected

**Peer dependencies:**
- First-party `@cinatra-ai/*` packages are declared as optional `peerDependencies` only — never in `dependencies` or `devDependencies`
- This is enforced by CI: `ci.yml` fails with exit 2 if first-party packages appear in non-peer fields

## Error Handling

- Not applicable — the source file exports a static manifest object with no runtime logic or error paths

## Logging

- Not applicable — no runtime code

## Comments

**Block comments:**
- File-level block comments describe the artifact's semantic purpose and scope (see `src/index.ts` lines 3–9)
- Comments clarify what this artifact IS and is NOT (distinct from other artifact types)
- `tsconfig.json` includes a `"//"` key used as an inline comment field explaining the config rationale

**Inline comments:**
- Used in CI YAML to explain skip logic and reasoning for each step

## Function Design

- Not applicable — the file exports one `const` object, no functions

## Module Design

**Exports:**
- Single named export per file: `export const brandVoiceArtifactManifest`
- No default exports
- No barrel re-export pattern observed (only one source file)

**Package entry point:**
- `"main"` and `"types"` both point to `./src/index.ts` (source mirror — built/consumed by the monorepo)

## Cinatra Extension Conventions

**Manifest duplication:**
- The artifact manifest shape is defined in both `src/index.ts` (TypeScript `const`) and `package.json` (`cinatra.artifact` field). These must be kept in sync manually — there is no code generation enforcing alignment.

**SKILL.md structure:**
- YAML frontmatter with `name` and `description` fields
- Sections: What it IS, What it is NOT, Confidence guidance, Output contract
- Output contract specifies strict JSON-only response (no markdown wrapper)
- Confidence thresholds documented as numeric ranges with rationale

**CI gating model:**
- Repos with host-internal `@cinatra-ai/*` optional peers skip standalone install/typecheck/test (monorepo runs those)
- Repos with zero first-party deps run full install + typecheck + test
- `npm pack --dry-run` always runs to validate package shape

---

*Convention analysis: 2026-06-09*
