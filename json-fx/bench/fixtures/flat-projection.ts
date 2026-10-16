import type { BenchFixture } from "./types";

/** Flat property projection with light arithmetic: the common "reshape one record" workload. */
export const flatProjection: BenchFixture = {
  name: "flat-projection",
  description: "reshape one record: property reads, string concat, comparisons",
  template: {
    "id": "$.id",
    "name": "$.first + ' ' + $.last",
    "email": "$.email:toLowerCase",
    "age": "$.age",
    "adult": "$.age >= 18",
    "city": "$.address.city",
    "zip": "$.address.zip",
    "balanceCents": "$.balance * 100",
    "tier": "'gold' if $.balance > 1000 else 'basic'"
  },
  makeInput: (k) => ({
    id: k,
    first: "First" + k,
    last: "Last" + (k % 13),
    email: `User${k}@Example.COM`,
    age: 10 + (k % 70),
    address: { city: "City" + (k % 50), zip: String(10000 + k) },
    balance: (k * 37) % 2000
  }),
  handWritten: (d) => ({
    id: d.id,
    name: d.first + " " + d.last,
    email: d.email.toLowerCase(),
    age: d.age,
    adult: d.age >= 18,
    city: d.address.city,
    zip: d.address.zip,
    balanceCents: d.balance * 100,
    tier: d.balance > 1000 ? "gold" : "basic"
  })
};
