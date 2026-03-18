# Rules: Procedural Programming v3

> Auto-loaded by Kilo Code for all PSD modes.
> Full guidelines: [`.kilocode/CORE.md`](../CORE.md)

---

## Core Principle

Strict Procedural Programming — linear, modular, data-behavior separated.
Three systems run in sync: Kilo Code tools + task.exe + Git.

---

## Mandatory Coding Rules

1. **NO OOP in own code** — no classes with methods, no inheritance, no polymorphism
   - Exception: Python `dataclass` (data-only), TypeScript `interface`/`type`
   - Exception: Objects from third-party libraries are allowed
2. **Modular** — related functions in one module file, max 400–500 lines per file
3. **Single responsibility** — every function does ONE thing, max 40–50 lines
4. **No hidden state** — pass state explicitly via parameters, avoid globals
5. **Max 3 levels of nesting** — use early return and helper extraction
6. **Documentation required** — all public functions documented
7. **Naming: descriptive verbs** — `calculate_total()`, `fetchUserData()`

---

## Mandatory Tracking Rules

At **every step boundary**, update all three systems:

```bash
# 1. task.exe
.kilocode/task_manager/task edit <ID> --description "<summary>"
.kilocode/task_manager/task complete <ID> --status done
.kilocode/task_manager/task complete <NEXT> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ current, 🔄 next
```
```bash
# 3. Git — one commit per step
git add .
git commit -m "<type>: Step <N> - <n>" \
           -m "<task summary>" \
           -m "Workflow: <feature> | Step: <N>/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Kilo Code Tools

- `update_todo_list` — UI tracking every step
- `new_task` — delegate complex modules (Steps 3, 4, 6)
- `ask_followup_question` — user confirmation at Steps 1, 3, 7
- `attempt_completion` — finalize at Step 8 only

---

## Git Flow Rules

- Always work on `feature/<slug>` branch during the 8-step workflow
- One commit per step — never skip a commit
- Merge to `develop` only at Step 8 after all commits are present
- Never push directly to `main`

---

## Slash Commands

- `/git-init` — setup repo, account, branches (run once per project)
- `/git-commit` — commit current step
- `/git-sync` — push + branch status
- `/task-check` — check all systems for unfinished tasks
- `/task-stats` — unified progress report
- `/task-export` — backup task.exe to JSON
