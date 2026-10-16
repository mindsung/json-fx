import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { JsonFx } from "../src";
import { v0Engine } from "./harness/engines";
import { cryptoExpressions } from "./extensions/crypto";

/** Extension compatibility smoke test (V1-PLAN.md §8, Phase 6): a v0-era extension package loads and runs unchanged. */

const template = {
  md5: "crypto~md5($.text)",
  sha1: "$.text:crypto~sha1",
  sha256: "$.text:crypto~sha256()",
  sha512: "crypto~sha512($.text)",
  sha3: "crypto~sha3($.text)",
  roundTrip: "crypto~decrypt(crypto~encrypt($.text, $.key), $.key)",
  chained: "$.words:map(($w) => $w:crypto~md5):join('-')"
};
const inputs = { $: { text: "hello world", key: "secret", words: ["a", "b"] } };
const hash = (algorithm: string, text: string) => createHash(algorithm).update(text).digest("hex");

describe.each(["closure", "codegen"] as const)("json-fx-crypto on v1 (%s)", (backend) => {
  const compiled = new JsonFx({ functions: [cryptoExpressions], backend }).compile(template);
  const out = compiled.run(inputs) as Record<string, string>;

  it("computes the hashes", () => {
    expect(out.md5).toBe(hash("md5", "hello world"));
    expect(out.sha1).toBe(hash("sha1", "hello world"));
    expect(out.sha256).toBe(hash("sha256", "hello world"));
    expect(out.sha512).toBe(hash("sha512", "hello world"));
    expect(out.sha3).toMatch(/^[0-9a-f]{128}$/); // CryptoJS SHA3 is Keccak-512, not NIST SHA3-512: only the shape is checked here
  });

  it("encrypts and decrypts, and chains with lambdas", () => {
    expect(out.roundTrip).toBe("hello world");
    expect(out.chained).toBe(`${hash("md5", "a")}-${hash("md5", "b")}`);
  });

  it("gives the same output as v0 (encryption is salted, so only its round trip is compared)", () => {
    const v0 = v0Engine.compile(template, cryptoExpressions as any).run(inputs) as Record<string, string>;
    expect(out).toEqual(v0);
  });

  it("works through the v0-style evaluate() entry point", () => {
    const evaluated = compiled.evaluate({ name: "$", value: inputs.$ }) as Record<string, string>;
    expect(evaluated.sha256).toBe(out.sha256);
  });
});
