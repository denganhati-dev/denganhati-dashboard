# /git-init

Setup Git repository, select GitHub account, configure Git Flow branches,
and link to a remote GitHub repo. Run once at the start of a new project.

---

## What This Does

1. Asks which GitHub account to use
2. Sets local git identity for this repo
3. Initializes local git repo (if needed)
4. Configures `.gitignore`
5. Creates GitHub remote repo via `gh`
6. Sets up Git Flow base branches (`main`, `develop`)
7. Creates the feature branch for the current workflow

---

## Steps

### 1. Check available GitHub accounts

```bash
gh auth status
```

Show the user which accounts are authenticated. Ask:

```
ask_followup_question:
  Which GitHub account do you want to use for this repo?
  (list the accounts shown by gh auth status)
```

### 2. Switch to the selected account

```bash
gh auth switch --user <selected-username>
gh auth status    # confirm active account
```

### 3. Collect repo details

```
ask_followup_question:
  - Repository name? (e.g. my-project)
  - Private or public?
  - Your name for git commits? (for local config)
  - Your email for git commits? (for local config)
  - Feature name for this workflow? (e.g. user-authentication)
    → will create branch: feature/user-authentication
```

### 4. Set local git identity

```bash
git config user.name "<name>"
git config user.email "<email>"
```

### 5. Initialize local repository

```bash
# Only if not already a git repo
git init
git checkout -b main    # ensure main is the default branch
```

### 6. Create .gitignore

Add these entries (append if file exists):

```gitignore
# Task Manager
tasks.db
tasks-backup-*.json
.kilocode/task_manager/task
.kilocode/task_manager/task.exe

# Python
__pycache__/
*.pyc
*.pyo
.venv/
dist/
*.egg-info/

# JavaScript / TypeScript
node_modules/
dist/
.next/
.nuxt/

# PHP
vendor/
.env

# General
.DS_Store
*.log
.env
.env.local
```

```bash
git add .gitignore
git commit -m "chore: initial .gitignore"
```

### 7. Create GitHub remote repository

```bash
gh repo create <repo-name> \
  --[private|public] \
  --source=. \
  --remote=origin \
  --push
```

### 8. Set up Git Flow base branches

```bash
# main is already pushed via --push above

# Create and push develop
git checkout -b develop
git push -u origin develop

# Return to main
git checkout main
```

### 9. Create feature branch

```bash
git checkout develop
git checkout -b feature/<feature-slug>
git push -u origin feature/<feature-slug>
```

### 10. Verify and report

```bash
git log --oneline --graph --all
git branch -vv
gh repo view --web    # open in browser (optional)
```

---

## Output Format

```
## /git-init Complete

### Account
Active GitHub account: <username>

### Repository
Name:    <repo-name>
URL:     https://github.com/<username>/<repo-name>
Visibility: private / public

### Git Identity (local)
Name:  <name>
Email: <email>

### Branch Structure
* feature/<slug>  ← current (HEAD)
  develop
  main

### Remote
origin → https://github.com/<username>/<repo-name>

### Next Step
Run /git-commit after completing each workflow step.
Current workflow step: Step 1 (in-progress)
```

---

## Notes

- Run from the **project root directory**
- `tasks.db` and binary files are excluded from version control via `.gitignore`
- If the repo already exists on GitHub, use `git remote add origin <url>` instead of `gh repo create`
- To use a different account later: `gh auth switch --user <username>` then re-run relevant steps
