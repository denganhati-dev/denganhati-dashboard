# /git-sync

Push current branch to remote and show full status:
branch position, unpushed commits, and remote sync state.

---

## What This Does

1. Verifies active GitHub account
2. Pushes current branch to remote
3. Shows branch status vs remote
4. Shows recent commit log
5. Shows working tree status

---

## Steps

### 1. Check active account and branch

```bash
gh auth status
git branch --show-current
git status
```

### 2. Fetch latest remote state

```bash
git fetch origin
```

### 3. Push current branch

```bash
git push origin <current-branch>
```

If push is rejected (diverged):
```bash
git pull --rebase origin <current-branch>
git push origin <current-branch>
```

### 4. Show branch status vs all remotes

```bash
git branch -vv
```

### 5. Show commit log with graph

```bash
git log --oneline --graph --all -15
```

### 6. Show working tree status

```bash
git status
```

---

## Output Format

```
## /git-sync

### Account
Active: <github-username>

### Branch
Current: <branch-name>
Remote:  origin/<branch-name>

### Push Result
✅ Pushed successfully — origin/<branch> is up to date.
— or —
⚠️  Push required a rebase — rebased and pushed.

### Branch Overview
<git branch -vv output>

### Commit Graph (last 15)
<git log --oneline --graph --all -15 output>

### Working Tree
<git status output>

### Workflow Progress
Feature branch commits so far:
  <list of step commits on feature/<slug>>
Steps committed: <N>/8
```

---

## Notes

- Safe to run at any time — does not modify task tracking state
- Run this to verify remote is up to date before sharing or reviewing
- If on `main` or `develop` by mistake, switch back:
  ```bash
  git checkout feature/<slug>
  ```
