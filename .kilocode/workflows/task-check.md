# /task-check

Check for any unfinished tasks across both tracking systems.
Run this before starting a new step or before integration.

---

## What This Does

Queries task.exe for any task that is not `done`, then cross-references
with the current Kilo Code `update_todo_list` state to identify anything
still pending or in-progress.

---

## Steps

### 1. Check task.exe (persistent state)

```bash
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task list --status pending
.kilocode/task_manager/task list --status in-progress
```

### 2. Check Kilo Code tools (session state)

Read the current `update_todo_list` state in the UI and identify
any step that is not marked ✅.

### 3. Compare and report

- If both systems agree and show nothing pending → all clear
- If task.exe shows pending items → list them
- If Kilo Code UI shows unchecked steps → list them
- If the two systems are out of sync → flag it

---

## Output Format

```
## /task-check

### task.exe State
[output of task list --tree]

### Unfinished in task.exe
Pending:     [list or "none"]
In-progress: [list or "none"]

### Kilo Code UI State
Steps not yet complete: [list or "none"]

### Sync Status
✅ Both systems are in sync.
— or —
⚠️  Systems are out of sync:
    task.exe shows: <X>
    Kilo Code UI shows: <Y>
    Action: manually sync update_todo_list to match task.exe state.

### Verdict
✅ No unfinished tasks — safe to proceed.
— or —
⚠️  Unfinished tasks found:
    - [task name] (status: in-progress / pending) [system: task.exe / Kilo Code / both]
    Complete these before proceeding.
```

---

## Notes

- Read-only command — does not modify any task in either system
- If `tasks.db` does not exist: run `.kilocode/task_manager/task init`
- If systems are out of sync: use `update_todo_list` to correct the Kilo Code UI,
  or use `[task] complete <ID> --status done` to correct task.exe
