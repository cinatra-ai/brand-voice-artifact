import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/brand-voice-artifact` is the brand-voice / tone-of-voice
// artifact extension. A semantic work product describing HOW a company writes
// -- tone attributes, voice principles, do / don't lists, sample phrases,
// terminology to use vs avoid. Distinct from the marketing strategy (the GTM
// plan) and the ICP (the audience).
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
