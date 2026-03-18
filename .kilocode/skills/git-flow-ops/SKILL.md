# SKILL: Git Flow Ops

## Purpose
Manage all Git and GitHub operations following **Git Flow** strategy.
Handles multi-account GitHub via `gh auth switch` (HTTPS).
Integrates with the 8-step workflow — every completed step produces a commit.

---

## Prerequisites

```bash
git --version    # Git must be installed
gh --version     # GitHub CLI must be installed
```

Install GitHub CLI: https://cli.github.com

---

## Multi-Account Setup

### How it works
GitHub CLI stores multiple authenticated accounts. Switch between them
using `gh auth switch` before any operation that touches a remote.

### List authenticated accounts
```bash
gh auth status
```

### Add a new account
```bash
gh auth login
# → select GitHub.com
# → select HTTPS
# → authenticate via browser or token
```

### Switch active account
```bash
gh auth switch --user <github-username>
gh auth status    # verify active account
```

### Set git committer identity per repo (local override)
```bash
git config user.name "Your Name"
git config user.email "your@email.com"
# (use --global for global, omit for local repo only)
```

---

## Git Flow Branch Structure

```
main          ← production-ready, tagged releases only
  └── develop ← integration branch, always deployable
        └── feature/<slug>  ← one per feature (this workflow)
        └── release/<v>     ← release preparation
        └── hotfix/<slug>   ← critical production fixes
```

### Branch naming convention
```
feature/<feature-slug>     e.g. feature/user-authentication
release/<version>          e.g. release/1.2.0
hotfix/<issue-slug>        e.g. hotfix/login-crash
```

---

## Workflow Initialization (`/git-init`)

Full reference: `.kilocode/workflows/git-init.md`

Quick summary:
```bash
# 1. Switch to correct GitHub account
gh auth switch --user <username>
gh auth status

# 2. Set local git identity
git config user.name "<name>"
git config user.email "<email>"

# 3. Init repo if needed
git init
echo "tasks.db" >> .gitignore
echo "tasks-backup-*.json" >> .gitignore
echo ".kilocode/task_manager/task" >> .gitignore
echo ".kilocode/task_manager/task.exe" >> .gitignore

# 4. Create GitHub repo
gh repo create <repo-name> --private --source=. --remote=origin

# 5. Setup Git Flow base branches
git checkout -b develop
git push -u origin develop
git checkout main
git push -u origin main

# 6. Create feature branch
git checkout develop
git checkout -b feature/<slug>
git push -u origin feature/<slug>
```

---

## Commit Pattern (per step)

Every completed step produces one commit on the feature branch.

### Commit message format
```
<type>: Step <N> - <step name>

<summary from task description>

Workflow: Feature/<feature-name>
Step: <N>/8
Task ID: <task-exe-id>
```

### Type mapping per step

| Step | Type | Example subject |
|------|------|-----------------|
| 1 | `docs` | `docs: Step 1 - Requirement Analysis` |
| 2 | `docs` | `docs: Step 2 - Data Modeling` |
| 3 | `docs` | `docs: Step 3 - Function Tree` |
| 4 | `feat` | `feat: Step 4 - Implementation` |
| 5 | `docs` | `docs: Step 5 - Documentation` |
| 6 | `test` | `test: Step 6 - Testing` |
| 7 | `refactor` | `refactor: Step 7 - Code Review fixes` |
| 8 | `chore` | `chore: Step 8 - Integration` |

### Commit command
```bash
git add .
git commit -m "<type>: Step <N> - <step name>" \
           -m "<summary from task description>" \
           -m "Workflow: Feature/<name> | Step: <N>/8 | Task ID: <id>"
```

---

## Push Pattern

Push after every commit (no separate push step needed):
```bash
git push origin feature/<slug>
```

---

## Step 8: Merge to develop

After all 8 steps are committed:
```bash
# Merge feature into develop (no fast-forward — preserve history)
git checkout develop
git merge --no-ff feature/<slug> -m "merge: feature/<slug> into develop"
git push origin develop

# Delete feature branch
git push origin --delete feature/<slug>
git branch -d feature/<slug>
```

---

## Release Flow (when ready to ship)

```bash
# Create release branch from develop
git checkout develop
git checkout -b release/<version>
git push -u origin release/<version>

# Finalize (bump version, update CHANGELOG)
git add .
git commit -m "chore: release <version>"

# Merge to main and tag
git checkout main
git merge --no-ff release/<version> -m "merge: release/<version> into main"
git tag -a v<version> -m "Release v<version>"
git push origin main --tags

# Merge back to develop
git checkout develop
git merge --no-ff release/<version> -m "merge: release/<version> back into develop"
git push origin develop

# Delete release branch
git push origin --delete release/<version>
git branch -d release/<version>
```

---

## Hotfix Flow

```bash
# Branch from main
git checkout main
git checkout -b hotfix/<slug>
git push -u origin hotfix/<slug>

# Fix, commit
git add .
git commit -m "fix: <description>"

# Merge to main and tag
git checkout main
git merge --no-ff hotfix/<slug> -m "merge: hotfix/<slug> into main"
git tag -a v<patch-version> -m "Hotfix v<patch-version>"
git push origin main --tags

# Merge to develop
git checkout develop
git merge --no-ff hotfix/<slug> -m "merge: hotfix/<slug> into develop"
git push origin develop

git push origin --delete hotfix/<slug>
git branch -d hotfix/<slug>
```

---

## .gitignore Entries (always add)

```gitignore
# Task Manager
tasks.db
tasks-backup-*.json
.kilocode/task_manager/task
.kilocode/task_manager/task.exe

# Common
__pycache__/
*.pyc
.env
node_modules/
.DS_Store
```

---

## Troubleshooting

### Wrong account pushing
```bash
gh auth status                        # check who is active
gh auth switch --user <username>      # switch account
git config user.email "<email>"       # fix local identity
```

### Diverged branches
```bash
git fetch origin
git log --oneline --graph origin/develop..HEAD   # see what's ahead
git rebase origin/develop                         # rebase if needed
```

### Undo last commit (keep changes)
```bash
git reset --soft HEAD~1
```

### Check branch status
```bash
git log --oneline --graph --all   # full branch tree
git status                        # working tree status
git branch -vv                    # tracking info
```
