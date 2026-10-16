import CryptoJS from "crypto-js";

/**
 * The definitions of archive/json-fx-crypto (`@mindsung/json-fx-crypto`, written for v0), copied verbatim apart from the
 * import and the `FxExpressionDefinition` type. They are the real-world sample of the v0 extension API that v1 must
 * keep accepting unchanged (V1-PLAN.md §7.2): `name` with a `~` namespace, `evaluate`, no `pure`.
 */
export const cryptoExpressions: ReadonlyArray<{ name: string; evaluate: (...args: any[]) => any }> = [
  { name: "crypto~md5", evaluate: (token: string) => CryptoJS.MD5(token).toString() },
  { name: "crypto~sha1", evaluate: (token: string) => CryptoJS.SHA1(token).toString() },
  { name: "crypto~sha256", evaluate: (token: string) => CryptoJS.SHA256(token).toString() },
  { name: "crypto~sha512", evaluate: (token: string) => CryptoJS.SHA512(token).toString() },
  { name: "crypto~sha3", evaluate: (token: string) => CryptoJS.SHA3(token).toString() },
  { name: "crypto~encrypt", evaluate: (token: string, key: string) => CryptoJS.AES.encrypt(token, key).toString() },
  {
    name: "crypto~decrypt",
    evaluate: (token: string, key: string) => {
      const hex = CryptoJS.AES.decrypt(token, key).toString();
      let message = "";

      for (let i = 0; i < hex.length; i += 2) {
        message += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }

      return message;
    }
  }
];
