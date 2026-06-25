# Brand Voice

A guide describing how a brand writes — tone attributes, do/don't examples, preferred terminology, and sample phrases. Brand Voice is the verbal-identity layer that keeps generated and human-written copy consistent across every channel and drafting workflow.

Install this artifact extension from the Cinatra marketplace and upload your brand's tone-of-voice document (Markdown, plain text, or PDF). The platform automatically classifies the file using a semantic matcher and attaches it as context to any connected drafting agent. No API keys or external credentials are required — authentication is handled by the Cinatra platform.

To configure, set the `matcherConfidenceThreshold` in the extension manifest if you need to tighten or relax the classification sensitivity (default: 0.7). For local development, run `node extension-kind-gate.mjs` from the repo root to validate the package shape before publishing. The TypeScript manifest in `src/index.ts` and the `cinatra.artifact` block in `package.json` must stay in sync manually — update both in the same commit.

The artifact exposes no HTTP endpoints. Its API contract is the JSON output of the bundled `brand-voice-matcher` skill: `{ "matches": boolean, "confidence": number, "rationale": string }`. A `confidence` at or above the threshold combined with `matches: true` causes the platform to accept the uploaded document.

If the platform rejects a valid brand-voice document, lower the `matcherConfidenceThreshold` or verify the uploaded file contains explicit voice attributes and tone sections. If the CI gate fails locally, run `node extension-kind-gate.mjs` to see the exact violation.

## Works with

- Blog Idea Generator agent
- Blog Draft Writer agent
- Blog Image Prompt agent
- Blog Pipeline agent

## Capabilities

- Capture tone attributes, do/don't phrasing, and preferred terminology in one place
- Ground drafting agents so generated copy stays on-brand
- Give writers and reviewers a single source of truth for verbal identity
- Attach as optional context to any agent that accepts a voice guide
