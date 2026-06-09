# Technology Stack

**Analysis Date:** 2026-06-09

## Languages

**Primary:**
- TypeScript — `src/index.ts` (single source file exporting the artifact manifest)

**Secondary:**
- YAML — GitHub Actions workflow definitions in `.github/workflows/`
- Markdown — skill classifier prompt in `skills/brand-voice-matcher/SKILL.md`

## Runtime

**Environment:**
- Node.js 24 (pinned in `.github/workflows/ci.yml` via `actions/setup-node`)

**Package Manager:**
- pnpm (via corepack — `corepack enable` invoked in CI)
- Lockfile: not committed (CI runs `pnpm install --no-frozen-lockfile`)

## Frameworks

**Core:**
- None — this is a minimal artifact-manifest package with a single TypeScript export and no runtime framework

**Testing:**
- Not applicable — no test runner or test files present; tests are run by the parent cinatra monorepo

**Build/Dev:**
- TypeScript compiler (`tsc`) — config in `tsconfig.json`; targets ES2023, ESNext modules, outputs to `dist/`

## Key Dependencies

**Critical:**
- `@cinatra-ai/sdk-extensions` — optional peer dependency; provides the `SemanticArtifactManifest` type imported in `src/index.ts`; resolved only within the cinatra monorepo workspace (not published to any public registry)

**Infrastructure:**
- No runtime dependencies, no devDependencies declared in `package.json`

## Configuration

**Environment:**
- No environment variables required by this package
- `.npmrc` is present (existence noted; contents not read)

**Build:**
- `tsconfig.json` — strict TypeScript, `moduleResolution: bundler`, `target: ES2023`, `outDir: dist`, `rootDir: src`, `verbatimModuleSyntax: true`, declaration maps and source maps enabled

**Package manifest:**
- `package.json` — `cinatra.apiVersion: cinatra.ai/v1`, `cinatra.kind: artifact`, ESM (`"type": "module"`), entry point `./src/index.ts`

## Platform Requirements

**Development:**
- Node.js 24, pnpm via corepack
- `@cinatra-ai/sdk-extensions` type resolution requires the cinatra monorepo workspace (standalone install skips typecheck when host-internal peers are detected)

**Production:**
- Published to `registry.cinatra.ai` via Cinatra Marketplace MCP proxy (triggered by GitHub Release); not published to npm
- Consumed as a workspace dependency inside the cinatra monorepo

---

*Stack analysis: 2026-06-09*
