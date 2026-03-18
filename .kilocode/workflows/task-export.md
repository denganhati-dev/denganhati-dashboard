# /task-export

Export all tasks from task.exe to a timestamped JSON backup file.
Kilo Code `update_todo_list` state is session-only and cannot be exported,
so this command captures the persistent task.exe state only.

---

## What This Does

Runs the task.exe export command with a timestamped filename and confirms
the file was created successfully.

---

## Steps

### 1. Generate timestamp and run export

```bash
.kilocode/task_manager/task export \
  --output tasks-backup-$(date +%Y%m%d-%H%M%S).json \
  --all
```

On Windows (PowerShell):
```powershell
$ts = Get-Date -Format "yyyyMMdd-HHmmss"
.kilocode\task_manager\task.exe export --output "tasks-backup-$ts.json" --all
```

### 2. Confirm the file was created

```bash
ls -lh tasks-backup-*.json
```

---

## Output Format

```
## /task-export

### Export Complete
File: tasks-backup-[TIMESTAMP].json
Location: [project root]

### Contents
- All tasks exported (pending, in-progress, done, cancelled)
- Includes all subtasks and descriptions

### File List
[output of ls -lh tasks-backup-*.json]

✅ Backup saved to project root.

> Note: Kilo Code update_todo_list state is session-only and not included
> in this export. The JSON captures the full task.exe persistent state.
```

---

## Notes

- Timestamped filename prevents overwriting previous backups
- `--all` flag includes completed and cancelled tasks
- File is saved in the **current working directory** (project root)
- To restore: `[task] import-tasks tasks-backup-[TIMESTAMP].json`
- If `tasks.db` does not exist: run `.kilocode/task_manager/task init`
