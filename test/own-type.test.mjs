/**
 * THE ONE TYPE THIS PACK DECLARES IS ONE THE HOST REGISTERS.
 *
 * The host registers a declared object type as an artifact type (listed, read,
 * and offered to agents that declare this pack as a dependency) only when the
 * type id's namespace, the part before the colon, is the declaring package's
 * own name. It reads that namespace as the type's registering package and skips
 * a declared type under any other namespace, with or without an inline schema.
 * A brand voice stored under a type the host never registers is on no listing,
 * so no agent can read it. These cases pin the declared type to this package's
 * own name, and the typed export to the manifest.
 *
 *   node --test test/own-type.test.mjs
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));
const OWN_TYPE = "@cinatra-ai/brand-voice-artifact:guide";

/** The registering package the host reads from a type id: its `@scope/package`
 *  prefix, or null for an id that has none. */
function registeringPackage(objectTypeId) {
  const i = objectTypeId.indexOf(":");
  if (i <= 0) return null;
  const ns = objectTypeId.slice(0, i);
  return /^@[\w-]+\/[\w-]+$/.test(ns) ? ns : null;
}

test("the pack declares one type, the brand-voice guide, under its own package name", () => {
  const types = (pkg.cinatra?.artifact?.objectTypes ?? []).map((c) => c.type);
  assert.deepEqual(types, [OWN_TYPE]);
});

test("every declared type's namespace is this package, so the host registers it", () => {
  const claims = pkg.cinatra?.artifact?.objectTypes ?? [];
  assert.ok(claims.length > 0, "the pack declares at least one type");
  for (const claim of claims) {
    assert.equal(registeringPackage(claim.type), pkg.name, `${claim.type} is registered by ${pkg.name}`);
    assert.equal(claim.claim, "dedicated");
  }
});

test("the typed export declares the same types as package.json", async () => {
  const { brandVoiceArtifactManifest } = await import("../src/index.ts");
  assert.deepEqual(brandVoiceArtifactManifest.objectTypes, pkg.cinatra.artifact.objectTypes);
});
