# Task Manager Binary

Place the task binary in this directory:

```
.kilocode/task_manager/task        ← Linux/macOS binary
.kilocode/task_manager/task.exe    ← Windows binary
```

## Setup

1. Download the binary for your platform from:
   https://github.com/YOUR_USERNAME/task-manager/releases/latest

2. Place it in this directory

3. Make it executable (Linux/macOS only):
   ```bash
   chmod +x .kilocode/task_manager/task
   ```

4. Initialize the database in your project root:
   ```bash
   .kilocode/task_manager/task init
   ```

## Usage

All workflow tracking goes through this binary.
Full usage reference: `.kilocode/skills/task-manager-ops/SKILL.md`

Quick check:
```bash
.kilocode/task_manager/task --help
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task stats
```
