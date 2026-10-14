# JSON-fx v1 — Progress & Handoff

Living handoff doc for the v1 implementation. The design lives in [`V1-PLAN.md`](V1-PLAN.md); this file records **decisions made while implementing, deviations from the plan, and where we are**. A fresh session should read this first, then the plan sections it points to.

- **Branch:** `feature/v1-code-gen` (docs-only commits may go straight to `develop`; implementation stays on the feature branch until stable).
- **Tag:** `v0-final` = `develop` @ `28bc28b` (pushed to origin).

---

## Decisions

### From the plan (owner, 2026-10-14) — see V1-PLAN.md header
- Parentheses end a `?` chain (Class C).
- Optional keys `"name?"` implemented (Class C).
- Bare words in value position stay string constants; unknown names in *call* position are compile errors.
- Own function properties of inputs stay callable; inherited functions blocked.
- Missing input throws lazily at run time.
- Trust model: authors trusted in our projects; published library hardens by default, is not a sandbox.

### Resolved §10 open questions (owner, 2026-10-14)
| Q | Decision |
|---|---|
| 5 | Keep lambda-arg normalization (`undefined` → `null`). |
| 6 | Closure backend is production-quality (and the semantic reference). |
| 7 | Dynamic keys over objects: `$v` = value, `$k` = key. |
| 9 | No async extension functions assumed. (If this changes, revisit in Phase 2 — it affects IR/API.) |
| 10 | String escapes: only `\'` and `\\`; other backslashes literal. |
| 8 | **Still open (non-blocking until Phase 6):** owner to supply sanitized real templates + sample inputs for the conformance corpus / release gate. |

### Implementation decisions (2026-10-14)
- **Layout:** v0 stays in `json-fx/src/` untouched until Phase 6. v1 is built in a new directory alongside it (`json-fx/src-v1/`, with `test/` and `bench/` for v1); at the end v0 is deleted and v1 is `git mv`'d into `src/`.
- **Toolchain:** add TS 5 + vitest for v1 code; **do not** touch v0's mocha/ts-node/tslint setup, so the v0 baseline (73 passing / 23 failing, see plan §0) stays reproducible while the corpus is ported. Full toolchain cut-over (drop tslint/polyfills/`lib: dom`, collapse `npm/package.json`, fix `exports`) happens when v0 is removed.
- **Tag:** `v0-final` created and pushed.

---

## Phasing / session plan

Each session ends green and committed. Phase numbers refer to V1-PLAN.md §8.

| Session | Scope | Status |
|---|---|---|
| 1 | **Phase 0** — groundwork: toolchain for v1, conformance runner (runs against v0), seed corpus, bench harness + v0 baseline, v0 npm alias + `compare` stub | **in progress** |
| 2 | **Phase 2** — errors, types, AST, scanner, Pratt parser, template reader, stdlib port (with `pure` metadata; fix B13, remove `funny`) | not started |
| 3 | **Phase 3** — resolver, closure backend, runtime helpers (security rules), public API (`run`/`evaluate`/`defineGlobal`), security tests | not started |
| 4 | **Phase 4** — `emit.ts` + fuzz tests, JS codegen, `backend: 'auto'`, differential test | not started |
| 5 | **Phase 5** (optimizer/inlining) + start of **Phase 6** (`json-fx check` CLI) | not started |
| 6 | **Phase 6** rest — README + Security section, migration guide, crypto smoke test, `compare` release gate over real templates, release 1.0.0 | not started |

Phase 1 (v0.2 hotfix) is skipped per the plan (trusted authors).

---

## Status log

### Session 1 — Phase 0
- [x] `v0-final` tag created and pushed
- [x] Branch `feature/v1-code-gen` created
- [x] `V1-PROGRESS.md` started
- [ ] v1 toolchain (TS 5, vitest) in `json-fx/`
- [ ] Conformance case format + runner that executes against v0
- [ ] Seed corpus (existing specs, README examples, archived examples, §3.2/§3.3 repros; fix `misc-debug` expectation to 10)
- [ ] Bench harness + fixtures + `bench/BASELINE.md` (v0 numbers)
- [ ] v0 npm alias + `compare` harness (v1 side stubbed); private corpus directory for real templates

## Deviations from the plan
_None yet._

## Notes for the next session
_None yet._
