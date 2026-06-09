# External Integrations

**Analysis Date:** 2026-06-09

## APIs & External Services

**Cinatra Marketplace:**
- Service: `registry.cinatra.ai` — the Cinatra extension registry where this artifact is published on release
  - Submission flow: GitHub Release → reusable workflow `cinatra-ai/.github/.github/workflows/reusable-extension-release.yml@main` → marketplace MCP proxy (`extension-submit-for-review`)
  - Auth: `CINATRA_MARKETPLACE_VENDOR_TOKEN` org secret (referenced in `.github/workflows/release.yml` via `secrets: inherit`)

**Cinatra Agent Platform:**
- This artifact is consumed at runtime by agents in the cinatra platform (Blog Idea Generator, Blog Draft Writer, Blog Image Prompt, Blog Pipeline) as optional brand voice context
- Integration is declarative: agents reference the artifact kind `@cinatra-ai/brand-voice-artifact`; no direct HTTP calls from this package

## Data Storage

**Databases:**
- Not applicable — this package contains no data storage layer

**File Storage:**
- Accepted input file formats (declared in manifest): `text/markdown`, `text/plain`, `application/pdf`
- Storage handled entirely by the cinatra platform; this package only declares accepted MIME types

**Caching:**
- Not applicable

## Authentication & Identity

**Auth Provider:**
- Not applicable at package level — authentication is handled by the cinatra platform and the GitHub Actions org secret `CINATRA_MARKETPLACE_VENDOR_TOKEN` for publishing

## Monitoring & Observability

**Error Tracking:**
- Not applicable — no runtime logic beyond a static manifest export

**Logs:**
- Not applicable

## CI/CD & Deployment

**Hosting:**
- `registry.cinatra.ai` (Cinatra Marketplace) — release publishing
- GitHub Actions — CI and release automation

**CI Pipeline:**
- GitHub Actions: `.github/workflows/ci.yml` — runs on push/PR to `main`
  - Jobs: `build` (classify repo shape, conditional install/typecheck/test, `npm pack --dry-run`) and `kind-gates` (no extra gate for `artifact` kind)
- GitHub Actions: `.github/workflows/release.yml` — triggered on GitHub Release published or manual `workflow_dispatch`
  - Delegates entirely to `cinatra-ai/.github` reusable workflow; grants `id-token: write` and `attestations: write` for build provenance

## Environment Configuration

**Required env vars:**
- None required at development or runtime by this package itself
- `CINATRA_MARKETPLACE_VENDOR_TOKEN` — GitHub org secret required only for release publishing (not local dev)

**Secrets location:**
- GitHub org-level secrets (not stored in repo); `.npmrc` present in repo root (contents not read)

## Webhooks & Callbacks

**Incoming:**
- Not applicable

**Outgoing:**
- Not applicable — the cinatra platform marketplace MCP proxy handles submission callbacks; this repo contains no webhook logic

## Skill Matcher Integration

**Skill:** `@cinatra-ai/brand-voice-artifact:brand-voice-matcher`
- Definition: `skills/brand-voice-matcher/SKILL.md`
- Role: LLM-based semantic classifier; returns `{ matches: boolean, confidence: number, rationale: string }` JSON
- Confidence threshold: 0.7 (declared in `package.json` `cinatra.artifact.matcherConfidenceThreshold` and mirrored in `src/index.ts`)
- Accepts: `text/markdown`, `text/plain`, `application/pdf` attachments

---

*Integration audit: 2026-06-09*
