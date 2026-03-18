# SKILL: Task Manager Ops

## Purpose
Manage all workflow task tracking using **two systems in sync**:
1. **Kilo Code built-in tools** — UI tracking, session-level visibility, agent coordination
2. **task.exe CLI binary** — persistent storage, cross-session history, export/backup

Both must be updated together at every step boundary. Neither replaces the other.

---

## Binary Path
```
.kilocode/task_manager/task        # Linux/macOS
.kilocode/task_manager/task.exe    # Windows
```
Referred to as `[task]` throughout this document.

---

## Dual Tracking: Roles & Responsibilities

| Concern | Kilo Code Tool | task.exe Command |
|---------|---------------|-----------------|
| Track step progress | `update_todo_list` | `[task] complete <ID> --status done` |
| Delegate complex work | `new_task` | `[task] subtask <ID> "..." --priority high` |
| Clarify requirements | `ask_followup_question` | `[task] edit <ID> --description "..."` |
| Finalize workflow | `attempt_completion` | `[task] complete <PARENT_ID> --status done` |
| View current state | `update_todo_list` (UI) | `[task] list --tree` |
| Persist across sessions | ❌ (session-only) | ✅ `tasks.db` persists |

---

## Setup (once per project)

```bash
[task] init
```

Creates `tasks.db` in the current working directory.

---

## Workflow Initialization (once per feature)

Both systems initialized together:

```
# 1. Kilo Code — create todo list for this session
update_todo_list:
  - [ ] Step 1: Requirement Analysis ⚠️
  - [ ] Step 2: Data Modeling
  - [ ] Step 3: Function Tree ⚠️
  - [ ] Step 4: Implementation
  - [ ] Step 5: Documentation
  - [ ] Step 6: Testing
  - [ ] Step 7: Code Review ⚠️
  - [ ] Step 8: Integration
```

```bash
# 2. task.exe — create persistent parent + 8 subtasks
[task] add "Feature: <name>" --priority high --tag workflow --tag <slug>
# → note PARENT_ID

[task] subtask <PARENT_ID> "Step 1: Requirement Analysis" --priority critical --tag step-1
[task] subtask <PARENT_ID> "Step 2: Data Modeling"        --priority high     --tag step-2
[task] subtask <PARENT_ID> "Step 3: Function Tree"        --priority high     --tag step-3
[task] subtask <PARENT_ID> "Step 4: Implementation"       --priority high     --tag step-4
[task] subtask <PARENT_ID> "Step 5: Documentation"        --priority medium   --tag step-5
[task] subtask <PARENT_ID> "Step 6: Testing"              --priority high     --tag step-6
[task] subtask <PARENT_ID> "Step 7: Code Review"          --priority high     --tag step-7
[task] subtask <PARENT_ID> "Step 8: Integration"          --priority high     --tag step-8

# 3. Verify
[task] list --tree
```

---

## Step Boundary Pattern (mandatory at EVERY step)

Both systems updated together — in this order:

```
BEFORE starting a step:
  → [task] list --tree                          # check persistent state
  → (read update_todo_list UI state)            # check session state

DURING a step:
  → add granular items to BOTH:
    [task] subtask <STEP_ID> "<item>" --priority high
    new_task: delegate "<item>" if complex

  → when a sub-item is done:
    [task] complete <ITEM_ID> --status done
    update_todo_list: mark sub-item ✅

AFTER completing a step (both systems simultaneously):
  → [task] edit <STEP_ID> --description "<summary>"
  → [task] complete <STEP_ID> --status done
  → [task] complete <NEXT_ID> --status in-progress
  → [task] list --tree                          # verify persistent state

  → update_todo_list: mark current step ✅, next step 🔄
  → (attempt_completion only at Step 8 final)
```

---

## Per-Step Dual Update Reference

### Step 1 — Requirement Analysis
```bash
# task.exe
[task] complete <STEP1_ID> --status in-progress
# ... clarify with ask_followup_question ...
[task] subtask <STEP1_ID> "Req: <detail>" --priority high   # per discovered req
[task] complete <REQ_ID> --status done
[task] edit <STEP1_ID> --description "Stack: <x>. In: <y>. Out: <z>. Edge: <w>."
[task] complete <STEP1_ID> --status done
[task] complete <STEP2_ID> --status in-progress
[task] list --tree
```
```
# Kilo Code
update_todo_list: ✅ Step 1, 🔄 Step 2
```

### Step 2 — Data Modeling
```bash
[task] subtask <STEP2_ID> "Define: <StructName>" --priority high
[task] complete <STRUCT_ID> --status done                    # per structure
[task] edit <STEP2_ID> --description "Defined: <list>"
[task] complete <STEP2_ID> --status done
[task] complete <STEP3_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 2, 🔄 Step 3
```

### Step 3 — Function Tree
```bash
[task] subtask <STEP3_ID> "Module: <name>" --priority high   # per planned module
# → new_task for complex modules if needed
[task] edit <STEP3_ID> --description "Approved. main() -> <summary>"
[task] complete <STEP3_ID> --status done
[task] complete <STEP4_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 3, 🔄 Step 4
```

### Step 4 — Implementation
```bash
[task] subtask <STEP4_ID> "Implement: <module>" --priority high
# → new_task to delegate module if needed
[task] complete <MODULE_ID> --status done                    # per module done
[task] edit <STEP4_ID> --description "Implemented: <list>"
[task] complete <STEP4_ID> --status done
[task] complete <STEP5_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 4, 🔄 Step 5
```

### Step 5 — Documentation
```bash
[task] subtask <STEP5_ID> "Docs: <module>" --priority medium
[task] complete <DOCS_ID> --status done                      # per module done
[task] edit <STEP5_ID> --description "Documented: all public functions"
[task] complete <STEP5_ID> --status done
[task] complete <STEP6_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 5, 🔄 Step 6
```

### Step 6 — Testing
```bash
[task] subtask <STEP6_ID> "Test: <module>" --priority high
[task] complete <TEST_ID> --status done                      # per module done
[task] edit <STEP6_ID> --description "Coverage: >80%. All tests pass."
[task] complete <STEP6_ID> --status done
[task] complete <STEP7_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 6, 🔄 Step 7
```

### Step 7 — Code Review
```bash
[task] subtask <STEP7_ID> "Fix: <issue at file:line>" --priority high
[task] complete <ISSUE_ID> --status done                     # per issue fixed
[task] edit <STEP7_ID> --description "Approved. Issues: <N> found, all fixed."
[task] complete <STEP7_ID> --status done
[task] complete <STEP8_ID> --status in-progress
[task] list --tree
```
```
update_todo_list: ✅ Step 7, 🔄 Step 8
```

### Step 8 — Integration (final)
```bash
[task] edit <STEP8_ID> --description "Integrated. Tests pass. CHANGELOG updated."
[task] complete <STEP8_ID> --status done
[task] complete <PARENT_ID> --status done
[task] list --tree
[task] stats
```
```
update_todo_list: ✅ Step 8 (all done)
attempt_completion: "Feature <name> complete. All 8 steps done."
```

---

## Kilo Code Tools — Usage Guide

### `update_todo_list`
- Use for **session-level visibility** — shows progress in the Kilo Code UI
- Update at every step boundary alongside task.exe
- Format: checkbox list with step names and status emoji

### `new_task`
- Use to **delegate** implementation of a separate module to a sub-agent
- Also create the corresponding subtask in task.exe for persistence:
  ```bash
  [task] subtask <STEP_ID> "Delegate: <module>" --priority high
  ```
- Mark both done when the sub-agent completes

### `ask_followup_question`
- Use at critical steps (1, 3, 7) for **user confirmation**
- Log the confirmed answer in task.exe description:
  ```bash
  [task] edit <STEP_ID> --description "Confirmed: <answer summary>"
  ```

### `attempt_completion`
- Use **only at Step 8** to formally close the workflow
- Run after both task.exe parent is `done` and all tests pass
- Provide a summary of what was built

---

## Slash Commands

| Command | What It Does |
|---------|-------------|
| `/task-check` | Check for any unfinished tasks (both systems) |
| `/task-stats` | Show progress summary (both systems) |
| `/task-export` | Backup tasks to timestamped JSON |

---

## Troubleshooting

### Lost task IDs between sessions
```bash
[task] list --tree           # see full tree with IDs
[task] list --tag step-4     # find by step tag
```

### Kilo Code UI and task.exe out of sync
Run `/task-check` to see the task.exe state, then manually sync
`update_todo_list` to match.

### Binary not executable (Linux/macOS)
```bash
chmod +x .kilocode/task_manager/task
```

### Database not found
```bash
[task] init    # run from project root
```
