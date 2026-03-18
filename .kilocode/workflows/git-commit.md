# /git-commit

Commit the current step's progress to the feature branch.
Run this immediately after a step is marked `done` in both tracking systems.

Commit message is generated automatically from the step name and
task description — no manual input needed.

---

## What This Does

1. Detects which step was just completed (from task CLI or context)
2. Verifies the feature branch is active
3. Stages all changes
4. Generates a structured commit message from task description
5. Commits and pushes to remote

---

## Steps

### 1. Verify branch and account

```bash
git branch --show-current          # must be feature/<slug>
gh auth status                     # confirm correct account is active
```

If on wrong branch:
```bash
git checkout feature/<slug>
```

If wrong account:
```bash
gh auth switch --user <username>
```

### 2. Get step info from task CLI

```bash
.kilocode/task_manager/task list --status in-progress
# → read step number and description of the just-completed step
```

Also read the completed step's description:
```bash
.kilocode/task_manager/task show <STEP_ID>
# → extract description field for commit body
```

### 3. Determine commit type

| Step | Commit Type |
|------|-------------|
| 1 — Requirement Analysis | `docs` |
| 2 — Data Modeling | `docs` |
| 3 — Function Tree | `docs` |
| 4 — Implementation | `feat` |
| 5 — Documentation | `docs` |
| 6 — Testing | `test` |
| 7 — Code Review | `refactor` |
| 8 — Integration | `chore` |

### 4. Stage all changes

```bash
git status                         # preview what will be staged
git add .
```

If nothing to stage (e.g. Steps 1–3 are design-only):
```bash
# Create a marker file to ensure the commit exists
echo "Step <N> complete: <step-name>" >> .workflow-progress
git add .workflow-progress
```

### 5. Commit with structured message

```bash
git commit \
  -m "<type>: Step <N> - <step name>" \
  -m "<summary from task description>" \
  -m "Workflow: <feature-name> | Step: <N>/8 | Task ID: <task-id>"
```

**Examples:**

```bash
# Step 1
git commit \
  -m "docs: Step 1 - Requirement Analysis" \
  -m "Stack: Python + FastAPI. In: user data dict. Out: user ID int. Edge: duplicate email." \
  -m "Workflow: user-authentication | Step: 1/8 | Task ID: 4"

# Step 4
git commit \
  -m "feat: Step 4 - Implementation" \
  -m "Implemented: validators.py, user_ops.py, db_queries.py" \
  -m "Workflow: user-authentication | Step: 4/8 | Task ID: 8"

# Step 6
git commit \
  -m "test: Step 6 - Testing" \
  -m "Coverage: 87%. 42 tests pass. Modules: test_validators, test_user_ops." \
  -m "Workflow: user-authentication | Step: 6/8 | Task ID: 10"
```

### 6. Push to remote

```bash
git push origin feature/<slug>
```

### 7. Verify

```bash
git log --oneline -5               # confirm commit is there
git status                         # working tree should be clean
```

---

## Output Format

```
## /git-commit Complete

### Commit
Branch:  feature/<slug>
Type:    <type>
Subject: <type>: Step <N> - <step name>
Body:    <summary>
Hash:    <short-hash>

### Push
Pushed to: origin/feature/<slug>
Status:    ✅ up to date

### Log (last 5)
<git log --oneline -5 output>

### Next
Continue to Step <N+1> or run /git-sync for full status.
```

---

## Notes

- Run this command **after** both tracking systems mark the step done
- For design-only steps (1–3) that produce no code files, a `.workflow-progress`
  marker file is created to ensure an empty commit does not occur
- If `git push` fails due to diverged history: run `git pull --rebase origin feature/<slug>` first
- Commit history on the feature branch will show 8 commits — one per step
