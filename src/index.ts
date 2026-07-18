import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/brand-voice-artifact` is the brand-voice / tone-of-voice
// artifact extension. A semantic work product describing HOW a company writes
// -- tone attributes, voice principles, do / don't lists, sample phrases,
// terminology to use vs avoid. Distinct from the marketing strategy (the GTM
// plan) and the ICP (the audience).
//
// The pack CLAIMS one dedicated typed object under the `@cinatra-ai/brand-voice`
// namespace: `brand-voice:guide` — the tone-of-voice guide the matcher classifies
// uploaded documents into. The claim (kind, dispositions, and the inline row JSON
// Schema it carries as its schema-source) is the manifest of record in
// package.json `cinatra.artifact.objectTypes`; the object-registry bridge reads
// it there. This typed export mirrors only the DESCRIPTOR half (representation
// forms + the classifier matcher) — the SDK `SemanticArtifactManifest` contract
// the bridge type-checks the descriptor against; the `objectTypes` claim block is
// validated host-side by the objects manifest schema.
//
// Artifact manifest shape: bytes-only matcher, no connectorRef / templates /
// agentDependencies. Mirrored in package.json `cinatra.artifact`.
export const brandVoiceArtifactManifest: SemanticArtifactManifest = {
  accepts: {
    file: {
      mimeTypes: ["text/markdown", "text/plain", "application/pdf"],
    },
  },
  skills: {
    matchers: ["@cinatra-ai/brand-voice-artifact:brand-voice-matcher"],
  },
  matcherConfidenceThreshold: 0.7,
};
