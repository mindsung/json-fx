import * as CryptoJS from "crypto-js";

export const fxCryptoExpressions = [
  {
    key: "md5",
    expression: (token: string) => CryptoJS.MD5(token).toString()
  },
  {
    key: "sha1",
    expression: (token: string) => CryptoJS.SHA1(token).toString()
  },
  {
    key: "sha256",
    expression: (token: string) => CryptoJS.SHA256(token).toString()
  },
  {
    key: "sha512",
    expression: (token: string) => CryptoJS.SHA512(token).toString()
  },
  {
    key: "sha3",
    expression: (token: string) => CryptoJS.SHA3(token).toString()
  },
  {
    key: "encrypt",
    expression: (token: string, key: string) => CryptoJS.AES.encrypt(token, key).toString()
  },
  {
    key: "decrypt",
    expression: (token: string, key: string) => {
      const hex = CryptoJS.AES.decrypt(token, key).toString();
      let message = "";

      for (let i = 0; i < hex.length; i += 2) {
        message += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      }

      return message;
    }
  }
];
