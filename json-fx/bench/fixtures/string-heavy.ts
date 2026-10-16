import type { BenchFixture } from "./types";

// Module-level helpers: see the note in order.ts about keepNames.
const words = (s: string) => s.split(" ").map(x => x.trim()).filter(x => !!x);
const connected = (s: string) => {
  const out = [""];
  let last: string | undefined;
  for (let i = 0; i < s.length; i++) {
    const c = s[i]!;
    const delim = /[^a-zA-Z0-9]/.test(c);
    if (out[out.length - 1] && (delim || (last && last === last.toLowerCase() && c === c.toUpperCase()))) { out.push(""); }
    if (!delim) { out[out.length - 1] += c.toLowerCase(); }
    last = c;
  }
  return out.filter(w => !!w);
};

export const stringHeavy: BenchFixture = {
  name: "string-heavy",
  description: "string built-ins: split/join/replace/case conversions",
  template: {
    "slug": "$.title:toLowerCase:trim:replace(' ', '-')",
    "initials": "$.name:split(' '):map($p => $p:substr(0, 1):toUpperCase):join('')",
    "label": "$.title:toTitleCase + ' (' + $.tags:join(', ') + ')'",
    "camel": "$.title:toCamelCase",
    "snake": "$.title:toSnakeCase",
    "startsWithA": "$.title:toLowerCase:startsWith('a')"
  },
  makeInput: (k) => ({
    title: `  Article Number ${k} About Things  `,
    name: `Given${k} Middle${k % 7} Family${k % 11}`,
    tags: ["alpha", "beta" + (k % 5), "gamma"]
  }),
  handWritten: (d) => {
    return {
      slug: d.title.toLowerCase().trim().split(" ").join("-"),
      initials: d.name.split(" ").map((p: string) => p.substr(0, 1).toUpperCase()).join(""),
      label: words(d.title).map(w => w[0]!.toUpperCase() + w.substr(1)).join(" ") + " (" + d.tags.join(", ") + ")",
      camel: connected(d.title).map((w, i) => i ? w[0]!.toUpperCase() + w.substr(1) : w).join(""),
      snake: words(d.title).join("_"),
      startsWithA: d.title.toLowerCase().startsWith("a")
    };
  }
};
