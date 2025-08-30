# Agent Operating Guide

Purpose: Keep `docs/GAME_PLAN.md` the single source of truth. Every answer and change must reflect, validate, or update the plan.

Scope: For AI/code agents and contributors working in this repository.

---

## Per-answer workflow (must follow)

Before you answer
1) Read `docs/GAME_PLAN.md` end-to-end. Note open checklists, roadmap items, and definitions.
2) Extract the user’s ask into a short checklist at the top of your reply. Include implicit requirements you infer.
3) Inspect the workspace for relevant files/dirs referenced by the plan (do not assume paths). Prefer reading larger chunks over many tiny reads.
4) If the ask impacts design or scope, plan the delta and where in `GAME_PLAN.md` it belongs (Roadmap, Checklists, Data model, Algorithms, QA, etc.).

While you answer
5) Keep answers concise and skimmable. Avoid repeating unchanged plans; report deltas only.
6) Make the smallest necessary edits; preserve style and structure. Put new code in the planned locations from `GAME_PLAN.md`.
7) If you implement or change behavior, update `docs/GAME_PLAN.md` in the same turn to reflect:
   - What changed and why (brief)
   - New/updated checklists and QA scenarios
   - Any new types, files, or algorithms
8) Run quick quality gates when code changes are made: build/lint/tests. Report PASS/FAIL briefly and fix obvious issues.

After you answer
9) Append a concise entry to the Plan Changelog in `docs/GAME_PLAN.md`:
   - Date (UTC), summary of changes, affected files/sections
   - Requirements coverage: map each requirement to Done/Deferred + reason
   - Follow-ups (next concrete steps)
10) Ensure your reply includes a short status and what’s next.

If the Changelog section does not exist in the plan, create it at the bottom with a `## Changelog` heading.

---

## Conventions

- File organization: follow the structure specified in `docs/GAME_PLAN.md` (src/game, src/ui, src/state, etc.).
- Commit messages (when applicable):
  - `docs: update game plan — <scope>`
  - `feat(game): <feature>`
  - `fix(ui): <bug>`
  - `test: <area>`
- Responses: use `##`/`###` headings, bullet lists, and short paragraphs. Avoid heavy code blocks unless requested. Keep terminal commands optional and minimal.
- Don’t leak tools or internal mechanics in user-facing messages.
- Prefer deterministic behavior (seeded RNG) and update the plan if seeds/flows change.

---

## Definition of done for any change

- Plan read, impacted sections identified.
- Code and docs updated together; checklists kept current.
- Quality gates run; issues resolved or clearly deferred with reasons.
- Reply includes requirements coverage and next steps.
