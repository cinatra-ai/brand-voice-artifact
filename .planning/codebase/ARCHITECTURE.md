<!-- refreshed: 2026-06-09 -->
# Architecture

**Analysis Date:** 2026-06-09

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│              Cinatra Platform (monorepo host)                │
│   Resolves @cinatra-ai/sdk-extensions at workspace level     │
└────────────────────────┬────────────────────────────────────┘
                         │ optional peer dependency
                         ▼
┌─────────────────────────────────────────────────────────────┐
│           @cinatra-ai/brand-voice-artifact (this repo)       │
│                                                              │
│  src/index.ts  ──exports──►  SemanticArtifactManifest        │
│                                                              │
│  skills/brand-voice-matcher/SKILL.md  (LLM classifier)       │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              Cinatra Artifact Runtime                        │
│  - Reads manifest (accepted mimeTypes, matcher skill ref,    │
│    confidence threshold)                                     │
│  - Invokes brand-voice-matcher skill with uploaded file      │
│  - Accepts/rejects document based on JSON `matches` result   │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Artifact Manifest (TS) | Declares accepted mimeTypes, linked matcher skill, confidence threshold | `src/index.ts` |
| Artifact Manifest (JSON) | Machine-readable copy embedded in package.json for Cinatra tooling | `package.json` (`.cinatra.artifact` key) |
| Brand-Voice Matcher Skill | LLM prompt classifying whether an attached document is a brand-voice guide | `skills/brand-voice-matcher/SKILL.md` |
| CI Pipeline | Validates package shape, typechecks, packs; enforces first-party peer discipline | `.github/workflows/ci.yml` |

## Pattern Overview

**Overall:** Cinatra Extension — Source Mirror Pattern

**Key Characteristics:**
- This repo is an *extracted source mirror* of a single artifact extension from the Cinatra monorepo.
- All `@cinatra-ai/*` packages are declared as **optional peerDependencies** only; they are never installed standalone — the host monorepo provides them.
- There is no business logic beyond the manifest export and the LLM skill prompt.
- The manifest is defined in two canonical locations that must stay in sync: `src/index.ts` (TypeScript) and `package.json` (`cinatra.artifact` block).

## Layers

**Manifest Layer:**
- Purpose: Declares what file types this artifact accepts and which skill classifies them.
- Location: `src/index.ts`
- Contains: A single exported `SemanticArtifactManifest` constant.
- Depends on: `@cinatra-ai/sdk-extensions` (type import only, optional peer).
- Used by: Cinatra platform runtime to configure the artifact extension.

**Skill Layer:**
- Purpose: Contains the LLM prompt (system message) that classifies whether a document is a brand-voice guide.
- Location: `skills/brand-voice-matcher/SKILL.md`
- Contains: Semantic classification rules, confidence thresholds, output JSON contract.
- Depends on: Nothing (plain Markdown consumed by the Cinatra skill runner).
- Used by: Cinatra runtime when the artifact's `skills.matchers` list is invoked.

**Package Metadata Layer:**
- Purpose: Provides machine-readable manifest copy for Cinatra tooling and npm packaging.
- Location: `package.json`
- Contains: `cinatra.apiVersion`, `cinatra.kind`, `cinatra.artifact` mirroring `src/index.ts`.
- Depends on: Nothing at runtime.

## Data Flow

### Document Classification Path

1. User uploads a file (`.md`, `.txt`, or `.pdf`) to the Cinatra platform targeting this artifact type.
2. Cinatra runtime reads the manifest from `src/index.ts` — checks `accepts.file.mimeTypes` against the uploaded file.
3. Runtime invokes the `@cinatra-ai/brand-voice-artifact:brand-voice-matcher` skill (`skills/brand-voice-matcher/SKILL.md`) with the file content.
4. The LLM returns `{ "matches": <boolean>, "confidence": <0..1>, "rationale": "..." }`.
5. Runtime compares `confidence` against `matcherConfidenceThreshold: 0.7` — accepts the document if threshold is met and `matches` is `true`.

**State Management:**
- Stateless. The extension holds no runtime state; all classification state lives in the LLM response.

## Key Abstractions

**SemanticArtifactManifest:**
- Purpose: SDK type that describes what an artifact extension accepts and how it matches documents.
- Examples: `src/index.ts` (`brandVoiceArtifactManifest`)
- Pattern: Single exported constant; type imported from `@cinatra-ai/sdk-extensions`.

**SKILL.md (LLM Classifier):**
- Purpose: A structured Markdown document treated as a system prompt by the Cinatra skill runner.
- Examples: `skills/brand-voice-matcher/SKILL.md`
- Pattern: Frontmatter metadata block (`name`, `description`) followed by plain-English classification rules and a strict JSON output contract.

## Entry Points

**TypeScript Export:**
- Location: `src/index.ts`
- Triggers: Imported by the Cinatra monorepo workspace when the extension is composed into the platform.
- Responsibilities: Exports `brandVoiceArtifactManifest` — the single authoritative manifest object.

**Cinatra Package Metadata:**
- Location: `package.json` (`.cinatra` key)
- Triggers: Read by Cinatra CLI tooling and the extraction/CI scripts.
- Responsibilities: Declares `kind: "artifact"`, accepted mimeTypes, matcher skill references, and `dependencies: []`.

## Architectural Constraints

- **Threading:** Not applicable — this is a declarative configuration package with no runtime execution in this repo.
- **Global state:** None. No module-level mutable state.
- **Circular imports:** Not applicable — single source file.
- **First-party peer discipline:** All `@cinatra-ai/*` packages MUST remain optional peerDependencies. CI enforces this with an exit-2 check in `.github/workflows/ci.yml` (lines 48–69). Violating this breaks the source-mirror contract.
- **Manifest sync:** `src/index.ts` and `package.json` (`cinatra.artifact`) must stay in sync manually — there is no code-generation step to enforce this.

## Anti-Patterns

### Adding @cinatra-ai/* to dependencies or devDependencies

**What happens:** A developer adds `@cinatra-ai/sdk-extensions` to `dependencies` or `devDependencies` instead of `peerDependencies`.
**Why it's wrong:** These packages live only in the Cinatra monorepo registry and cannot be resolved in standalone installs or CI. The CI gate fails with exit 2.
**Do this instead:** Declare as `peerDependencies` with `peerDependenciesMeta.<pkg>.optional: true`, as already established in `package.json`.

### Diverging the TypeScript manifest from the package.json cinatra block

**What happens:** `src/index.ts` is updated (e.g., threshold changed) but `package.json`'s `cinatra.artifact` is not, or vice versa.
**Why it's wrong:** Cinatra tooling reads `package.json`; the runtime reads the TypeScript export. They diverge silently.
**Do this instead:** Treat both locations as a single logical manifest. Always update both files in the same commit.

## Error Handling

**Strategy:** Not applicable at the extension level — there is no runtime code that can throw. Error handling is the responsibility of the Cinatra platform runtime that invokes the skill and interprets the JSON output.

**Patterns:**
- The skill's JSON output contract is strict (`matches`, `confidence`, `rationale`). Malformed LLM output is handled by the Cinatra runtime, not this repo.

## Cross-Cutting Concerns

**Logging:** Not applicable — no runtime code.
**Validation:** CI enforces package shape via inline Node.js script in `.github/workflows/ci.yml`.
**Authentication:** Not applicable — this is a declarative package with no network calls.

---

*Architecture analysis: 2026-06-09*
