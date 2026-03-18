# AGENTS.md — Procedural Programming Development Guidelines v3

> Entry point. Core guidelines: [`.kilocode/CORE.md`](.kilocode/CORE.md)

---

## Quick Start

### Available Modes

| Mode | When to Use |
|------|-------------|
| `💡 PSD Brainstorm` | Explore ideas, research stack, initial design |
| `💻 PSD Dev` | Feature implementation — strict procedural + three-system tracking |
| `🔍 PSD Review` | Code review against procedural checklist |
| `🤖 PSD Auto` | End-to-end autonomous development |

---

## Three-System Integration

Every workflow run coordinates three systems simultaneously:

| System | Role |
|--------|------|
| Kilo Code tools | UI visibility, session tracking, agent coordination |
| task.exe (`.kilocode/task_manager/task`) | Persistent task storage |
| Git + GitHub CLI | Step-by-step commit history, multi-account |

**Feature branch gets exactly 8 commits — one per step.**

---

## Setup Checklist (once per project)

```bash
# 1. Verify tools
git --version
gh --version
.kilocode/task_manager/task --help

# 2. Run /git-init
#    → select account, set identity, create repo, setup branches

# 3. Run task init
.kilocode/task_manager/task init

# 4. Start workflow with /task-init equivalent in PSD Dev
```

---

## Slash Commands

| Command | What It Does |
|---------|-------------|
| `/git-init` | Setup repo, select GitHub account, create Git Flow branches |
| `/git-commit` | Commit current step with auto-generated message |
| `/git-sync` | Push + full branch status |
| `/task-check` | Check for unfinished tasks across all systems |
| `/task-stats` | Unified progress report from all systems |
| `/task-export` | Backup task.exe state to JSON |

---

## Multi-Account GitHub

```bash
gh auth status                       # list all authenticated accounts
gh auth switch --user <username>     # switch active account
gh auth login                        # add a new account
git config user.name "<n>"           # set local git identity
git config user.email "<email>"
```

---

## Git Flow Reference

```
main          ← production (tagged releases)
  └── develop ← integration (always deployable)
        └── feature/<slug>   ← one per workflow, 8 commits
        └── release/<v>      ← release preparation
        └── hotfix/<slug>    ← critical fixes
```

Full Git Flow reference: **[`.kilocode/skills/git-flow-ops/SKILL.md`](.kilocode/skills/git-flow-ops/SKILL.md)**

---

## Core Guidelines

- **[`.kilocode/CORE.md`](.kilocode/CORE.md)** — single source of truth
- **[`.kilocode/QUICK_REFERENCE.md`](.kilocode/QUICK_REFERENCE.md)** — cheat sheet
- **[`.kilocode/TROUBLESHOOTING.md`](.kilocode/TROUBLESHOOTING.md)** — common issues
- **[`.kilocode/skills/git-flow-ops/SKILL.md`](.kilocode/skills/git-flow-ops/SKILL.md)** — Git integration
- **[`.kilocode/skills/task-manager-ops/SKILL.md`](.kilocode/skills/task-manager-ops/SKILL.md)** — task tracking

---

## File Structure

```
psd-guidelines/
├── AGENTS.md
└── .kilocode/
    ├── CORE.md
    ├── QUICK_REFERENCE.md
    ├── TROUBLESHOOTING.md
    ├── mcp.json
    ├── task_manager/
    │   ├── task / task.exe
    │   └── README.md
    ├── rules/
    │   └── procedural-programming.md
    ├── skills/
    │   ├── git-flow-ops/            # Git + GitHub CLI integration
    │   ├── task-manager-ops/        # Dual task tracking
    │   ├── procedural-refactorer/
    │   ├── state-decoupler/
    │   ├── doxygen-docstring-generator/
    │   ├── v-model-tester/
    │   ├── changelog-generator/
    │   └── stack-researcher/
    ├── workflows/
    │   ├── top-down-development.md
    │   ├── git-init.md              # /git-init
    │   ├── git-commit.md            # /git-commit
    │   ├── git-sync.md              # /git-sync
    │   ├── task-check.md            # /task-check
    │   ├── task-stats.md            # /task-stats
    │   └── task-export.md           # /task-export
    └── templates/
        └── CODE_REVIEW_CHECKLIST.md
```
