# /task-stats

Show a progress summary across both tracking systems.
Use this for a quick health check on the current workflow.

---

## What This Does

Runs task.exe stats and tree view, then compares with the Kilo Code
`update_todo_list` UI state to give a unified progress report.

---

## Steps

### 1. task.exe stats

```bash
.kilocode/task_manager/task stats
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task list --status done
.kilocode/task_manager/task list --status in-progress
.kilocode/task_manager/task list --status pending
```

### 2. Kilo Code UI state

Read the current `update_todo_list` and count checked vs unchecked steps.

### 3. Synthesize a unified report

---

## Output Format

```
## /task-stats

### task.exe Summary
[output of task stats]

### Step-by-Step Tree
[output of task list --tree]

### Status Counts (task.exe)
- ✅ Done:        [N] tasks
- 🔄 In-progress: [N] tasks
- ⏳ Pending:     [N] tasks
- ❌ Cancelled:   [N] tasks

### Kilo Code UI Summary
- ✅ Complete steps: [N] / 8
- 🔄 Current step:  Step [N] — [step name]
- ⏳ Remaining:     [N] steps

### Sync Status
✅ Both systems in sync.
— or —
⚠️  Out of sync — reconcile before proceeding.

### Verdict
[One of:]
✅ All 8 steps complete — workflow finished.
🔄 Currently on Step [N]: [step name]
⏳ [N] steps still pending.
```

---

## Notes

- Read-only command — does not modify any task in either system
- If `tasks.db` does not exist: run `.kilocode/task_manager/task init`
