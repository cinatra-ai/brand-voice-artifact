# Testing Patterns

**Analysis Date:** 2026-06-09

## Overview

This is a Cinatra source-mirror artifact extension. It has no local test files and no test framework configured. Testing is intentionally delegated to the host monorepo, which resolves the `@cinatra-ai/*` peer dependencies that this repo's source depends on.

## Test Framework

**Runner:**
- Not configured locally — no `jest.config.*`, `vitest.config.*`, or similar detected
- The monorepo provides the test runner for this repo's code

**Assertion Library:**
- Not applicable locally

**Run Commands:**
```bash
# CI uses pnpm with --if-present to avoid failure when no test script is defined:
corepack pnpm test --if-present

# For standalone repos (no @cinatra-ai/* peers), this would invoke the `test`
# script from package.json. No such script is defined in this repo.
```

## Test File Organization

**Location:**
- No test files found in this repository

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable — no tests exist in this repo

**Patterns:**
- Not applicable

## Mocking

**Framework:**
- Not applicable

**What to Mock:**
- Not applicable

**What NOT to Mock:**
- Not applicable

## Fixtures and Factories

**Test Data:**
- Not applicable

**Location:**
- Not applicable

## Coverage

**Requirements:**
- None enforced locally

**View Coverage:**
```bash
# Not configured
```

## Test Types

**Unit Tests:**
- Not present locally; the monorepo tests the compiled artifact manifest shape

**Integration Tests:**
- Not present locally

**E2E Tests:**
- Not applicable

## CI Gating (Substitute for Tests)

The CI pipeline in `.github/workflows/ci.yml` acts as the quality gate for this repo. Because the repo declares `@cinatra-ai/sdk-extensions` as an optional peer dependency, it is classified as a "source mirror" and all install/typecheck/test steps are skipped with an explicit log message. The monorepo runs these.

**Effective CI checks that run for this repo:**

1. **First-party dep shape validation** — inline `node -e` script in `ci.yml` (lines 49–58) ensures no `@cinatra-ai/*` packages appear in `dependencies`, `devDependencies`, or `optionalDependencies`. Violations exit with code 2 and fail the build.

2. **peerDependenciesMeta.optional enforcement** — same script checks that all `@cinatra-ai/*` peer deps are marked `optional: true` in `peerDependenciesMeta`.

3. **Pack dry-run** — `npm pack --dry-run` validates the published package shape and payload without requiring peer resolution. Always runs regardless of source-mirror status.

4. **Kind-specific gate** — `kind-gates` job runs after `build`; for `artifact` kind there is no additional gate today (documented in `ci.yml` lines 129–141).

## SKILL.md Prompt Testing

The `skills/brand-voice-matcher/SKILL.md` classifier has no automated test harness in this repo. Confidence threshold behavior (0.7 minimum, per `package.json` `matcherConfidenceThreshold`) is a runtime concern validated by the monorepo's LLM evaluation suite, not by unit tests here.

---

*Testing analysis: 2026-06-09*
