# Quick Reference — Procedural Programming v3

> One-page cheat sheet. Full guidelines: [CORE.md](CORE.md)

---

## 🚀 Flow at a Glance

```
/git-init → Step1* → Step2 → Step3* → Step4 → Step5 → Step6 → Step7* → Step8 → merge develop
            ⚠️ confirm        ⚠️ confirm                       ⚠️ confirm
            [3-system update + git commit at every step]
```

---

## 📋 8-Step Summary

| Step | Name | Auto? | Commit Type |
|------|------|-------|-------------|
| 1 ⚠️ | Requirements | **Confirm** | `docs` |
| 2 | Data Modeling | Auto | `docs` |
| 3 ⚠️ | Function Tree | **Confirm** | `docs` |
| 4 | Implementation | Auto | `feat` |
| 5 | Documentation | Auto | `docs` |
| 6 | Testing | Auto | `test` |
| 7 ⚠️ | Code Review | **Confirm** | `refactor` |
| 8 | Integration | Auto | `chore` + merge |

---

## ⚡ Step Completion Pattern (mandatory)

```bash
# 1. task.exe
.kilocode/task_manager/task edit <ID> --description "<summary>"
.kilocode/task_manager/task complete <ID> --status done
.kilocode/task_manager/task complete <NEXT> --status in-progress
.kilocode/task_manager/task list --tree

# 2. Kilo Code
update_todo_list: ✅ current, 🔄 next

# 3. Git
git add .
git commit -m "<type>: Step <N> - <name>" \
           -m "<task summary>" \
           -m "Workflow: <feature> | Step: <N>/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## 🖥️ Slash Commands

| Command | What It Does |
|---------|-------------|
| `/git-init` | Setup repo, select account, create branches |
| `/git-commit` | Commit current step with auto-generated message |
| `/git-sync` | Push + show full branch status |
| `/task-check` | Check unfinished tasks in all systems |
| `/task-stats` | Progress summary from all systems |
| `/task-export` | Backup task.exe to JSON |

---

## 🌿 Git Flow Branches

```
main          ← releases only (tagged)
  └── develop ← integration
        └── feature/<slug>  ← 8 commits, one per step
        └── release/<v>     ← release prep
        └── hotfix/<slug>   ← critical fixes
```

---

## 🤖 Kilo Code Tools

| Tool | When |
|------|------|
| `update_todo_list` | Every step boundary |
| `new_task` | Steps 3, 4, 6 (complex modules) |
| `ask_followup_question` | Steps 1, 3, 7 (critical) |
| `attempt_completion` | Step 8 only |

---

## 👤 Multi-Account GitHub

```bash
gh auth status                       # list accounts
gh auth switch --user <username>     # switch active account
git config user.name "<n>"           # set local identity
git config user.email "<email>"
```

---

## ✅ Coding Rules at a Glance

| Rule | Description | Fix |
|------|-------------|-----|
| No OOP (own code) | Classes + methods forbidden | Struct + standalone functions |
| Third-party OK | External OOP libraries allowed | Our code stays procedural |
| < 50 lines | Functions must be small | Extract helpers |
| No globals | Pass state explicitly | Use parameters |
| Single responsibility | 1 function = 1 thing | Split functions |
| Max 3 nesting | No deeper levels | Early return + helpers |
| Descriptive verbs | Clear function names | `calculate_total()` |

---

## 🎯 Naming Convention

| Element | Python | JS/TS | PHP |
|---------|--------|-------|-----|
| Functions | `snake_case` | `camelCase` | `snake_case` |
| Variables | `snake_case` | `camelCase` | `camelCase` |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` |
| Types | `PascalCase` | `PascalCase` | `PascalCase` |

---

## 🔧 Skills

| Skill | Trigger |
|-------|---------|
| **Git Flow Ops** | Pre-workflow setup, every commit, Step 8 merge |
| **Task Manager Ops** | Every step boundary (dual tracking) |
| **Procedural Refactorer** | Nesting > 3, > 50 lines |
| **State Decoupler** | Global variables |
| **Doxygen Generator** | Step 5 |
| **V-Model Tester** | Step 6 |
| **Stack Researcher** | Unfamiliar tech |
| **Changelog Generator** | Step 8 |

---

## 🔗 References

- [CORE.md](CORE.md) | [TROUBLESHOOTING.md](TROUBLESHOOTING.md)
- [skills/git-flow-ops/SKILL.md](skills/git-flow-ops/SKILL.md)
- [skills/task-manager-ops/SKILL.md](skills/task-manager-ops/SKILL.md)
- [workflows/top-down-development.md](workflows/top-down-development.md)
- [templates/CODE_REVIEW_CHECKLIST.md](templates/CODE_REVIEW_CHECKLIST.md)
