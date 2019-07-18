import { fx } from "../common";

const template = {
  "$a": ["'A'", "'B'", "'C'"],
  "out": "$a[0]"
};
const args = [];

console.log(fx(template, args));
