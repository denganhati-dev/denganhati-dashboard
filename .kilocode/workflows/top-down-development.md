# Workflow: Top-Down Development

> Detailed per-step actions with three-system coordination.
> CORE.md | skills/task-manager-ops/SKILL.md | skills/git-flow-ops/SKILL.md

---

## Three-System Update at Every Step

```
After completing each step — always in this order:

  1. task.exe     → edit description, mark done, advance next
  2. Kilo Code    → update_todo_list ✅ current, 🔄 next
  3. Git          → commit + push (one commit per step)
```

---

## Pre-Workflow: Three-System Initialization

### Git (`/git-init`)
```bash
gh auth status
gh auth switch --user <username>
git config user.name "<n>"
git config user.email "<email>"
git init
# setup .gitignore, create GitHub repo
git checkout -b develop && git push -u origin develop
git checkout main && git push -u origin main
git checkout develop
git checkout -b feature/<slug>
git push -u origin feature/<slug>
```

### task.exe
```bash
.kilocode/task_manager/task init
.kilocode/task_manager/task add "Feature: <n>" --priority high --tag workflow --tag <slug>
.kilocode/task_manager/task subtask <PARENT_ID> "Step 1: Requirement Analysis" --priority critical --tag step-1
.kilocode/task_manager/task subtask <PARENT_ID> "Step 2: Data Modeling"        --priority high     --tag step-2
.kilocode/task_manager/task subtask <PARENT_ID> "Step 3: Function Tree"        --priority high     --tag step-3
.kilocode/task_manager/task subtask <PARENT_ID> "Step 4: Implementation"       --priority high     --tag step-4
.kilocode/task_manager/task subtask <PARENT_ID> "Step 5: Documentation"        --priority medium   --tag step-5
.kilocode/task_manager/task subtask <PARENT_ID> "Step 6: Testing"              --priority high     --tag step-6
.kilocode/task_manager/task subtask <PARENT_ID> "Step 7: Code Review"          --priority high     --tag step-7
.kilocode/task_manager/task subtask <PARENT_ID> "Step 8: Integration"          --priority high     --tag step-8
.kilocode/task_manager/task complete <STEP1_ID> --status in-progress
.kilocode/task_manager/task list --tree
```

### Kilo Code
```
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

---

## Step 1 ⚠️ — Requirement Analysis

**CRITICAL — user confirmation required**

### Work
```
ask_followup_question: requirements, tech stack, constraints, entry point
```
```bash
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task subtask <STEP1_ID> "Req: <detail>" --priority high
.kilocode/task_manager/task complete <REQ_ID> --status done
```

### Complete (after user confirms) — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP1_ID> --description "Stack: <x>. In: <y>. Out: <z>. Edge: <w>."
.kilocode/task_manager/task complete <STEP1_ID> --status done
.kilocode/task_manager/task complete <STEP2_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 1, 🔄 Step 2
```
```bash
# 3. Git
echo "Step 1 complete: $(date)" >> .workflow-progress
git add .
git commit \
  -m "docs: Step 1 - Requirement Analysis" \
  -m "Stack: <x>. In: <y>. Out: <z>. Edge: <w>." \
  -m "Workflow: <feature> | Step: 1/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 2 — Data Modeling

### Work
```bash
.kilocode/task_manager/task list --tree    # Step 1: done
.kilocode/task_manager/task subtask <STEP2_ID> "Define: <StructName>" --priority high
# ... define structures ...
.kilocode/task_manager/task complete <STRUCT_ID> --status done
```

### Complete — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP2_ID> --description "Defined: <StructA>, <StructB>"
.kilocode/task_manager/task complete <STEP2_ID> --status done
.kilocode/task_manager/task complete <STEP3_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 2, 🔄 Step 3
```
```bash
# 3. Git
git add .
git commit \
  -m "docs: Step 2 - Data Modeling" \
  -m "Defined: <StructA>, <StructB>" \
  -m "Workflow: <feature> | Step: 2/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 3 ⚠️ — Function Tree

**CRITICAL — user confirmation required**

### Work
```
ask_followup_question: confirm function tree design
new_task: delegate complex module design if needed
```
```bash
.kilocode/task_manager/task list --tree    # Step 2: done
.kilocode/task_manager/task subtask <STEP3_ID> "Module: validators"  --priority high
.kilocode/task_manager/task subtask <STEP3_ID> "Module: user_ops"    --priority high
.kilocode/task_manager/task subtask <STEP3_ID> "Module: db_queries"  --priority high
```

Function tree format:
```
main()
├── validate_input(data) → bool
├── transform_data(data) → ProcessedData
│   ├── normalize_fields(raw) → dict
│   └── apply_business_rules(normalized) → dict
└── save_to_db(db, data) → int
```

### Complete (after user confirms) — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP3_ID> --description "Approved. main() -> validate_input(), transform_data(), save_to_db()"
.kilocode/task_manager/task complete <STEP3_ID> --status done
.kilocode/task_manager/task complete <STEP4_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 3, 🔄 Step 4
```
```bash
# 3. Git
git add .
git commit \
  -m "docs: Step 3 - Function Tree" \
  -m "Approved. main() -> validate_input(), transform_data(), save_to_db()" \
  -m "Workflow: <feature> | Step: 3/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 4 — Implementation

### Work
```
new_task: delegate per-module implementation
```
```bash
.kilocode/task_manager/task list --tree    # Step 3: done

.kilocode/task_manager/task subtask <STEP4_ID> "Implement: validators.py" --priority high
# ... implement ...
.kilocode/task_manager/task complete <MODULE_ID> --status done

.kilocode/task_manager/task subtask <STEP4_ID> "Implement: user_ops.py"   --priority high
# ... implement ...
.kilocode/task_manager/task complete <MODULE_ID> --status done
```

Implementation order: utility functions → data access → business logic → orchestrator → entry point

### Complete — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP4_ID> --description "Implemented: validators.py, user_ops.py, db_queries.py"
.kilocode/task_manager/task complete <STEP4_ID> --status done
.kilocode/task_manager/task complete <STEP5_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 4, 🔄 Step 5
```
```bash
# 3. Git
git add .
git commit \
  -m "feat: Step 4 - Implementation" \
  -m "Implemented: validators.py, user_ops.py, db_queries.py" \
  -m "Workflow: <feature> | Step: 4/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 5 — Documentation

**Skill:** `doxygen-docstring-generator`

### Work
```bash
.kilocode/task_manager/task list --tree    # Step 4: done
.kilocode/task_manager/task subtask <STEP5_ID> "Docs: validators.py" --priority medium
# ... add docstrings ...
.kilocode/task_manager/task complete <DOCS_ID> --status done
```

### Complete — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP5_ID> --description "All public functions documented"
.kilocode/task_manager/task complete <STEP5_ID> --status done
.kilocode/task_manager/task complete <STEP6_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 5, 🔄 Step 6
```
```bash
# 3. Git
git add .
git commit \
  -m "docs: Step 5 - Documentation" \
  -m "All public functions documented: validators, user_ops, db_queries" \
  -m "Workflow: <feature> | Step: 5/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 6 — Testing

**Skill:** `v-model-tester`
Test categories: boundary values, path testing, equivalence partitions, error paths

### Work
```
new_task: create dedicated testing sub-task if needed
```
```bash
.kilocode/task_manager/task list --tree    # Step 5: done
.kilocode/task_manager/task subtask <STEP6_ID> "Test: test_validators.py" --priority high
# ... write and run tests ...
.kilocode/task_manager/task complete <TEST_ID> --status done
```

### Complete — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP6_ID> --description "Coverage: 87%. 42 tests pass."
.kilocode/task_manager/task complete <STEP6_ID> --status done
.kilocode/task_manager/task complete <STEP7_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 6, 🔄 Step 7
```
```bash
# 3. Git
git add .
git commit \
  -m "test: Step 6 - Testing" \
  -m "Coverage: 87%. 42 tests pass." \
  -m "Workflow: <feature> | Step: 6/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 7 ⚠️ — Code Review

**CRITICAL — user approval required**
**Checklist:** `.kilocode/templates/CODE_REVIEW_CHECKLIST.md`

### Work
```
ask_followup_question: Approve / Request changes / Minor fixes
```
```bash
.kilocode/task_manager/task list --tree    # Step 6: done
.kilocode/task_manager/task subtask <STEP7_ID> "Fix: <issue at file:line>" --priority high
# ... fix ...
.kilocode/task_manager/task complete <ISSUE_ID> --status done
```

### Complete (after user approves) — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP7_ID> --description "Approved. Issues: <N>, all fixed."
.kilocode/task_manager/task complete <STEP7_ID> --status done
.kilocode/task_manager/task complete <STEP8_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 7, 🔄 Step 8
```
```bash
# 3. Git
git add .
git commit \
  -m "refactor: Step 7 - Code Review" \
  -m "Approved. Issues: <N> found, all fixed." \
  -m "Workflow: <feature> | Step: 7/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

## Step 8 — Integration

**Skills:** `changelog-generator`

### Work
```bash
.kilocode/task_manager/task list --tree    # Step 7: done
# integrate, run full test suite, update CHANGELOG.md
```

### Complete — three systems
```bash
# 1. task.exe
.kilocode/task_manager/task edit <STEP8_ID> --description "Integrated. Full tests pass. CHANGELOG updated."
.kilocode/task_manager/task complete <STEP8_ID> --status done
.kilocode/task_manager/task complete <PARENT_ID> --status done
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task stats
```
```
# 2. Kilo Code
update_todo_list: ✅ Step 8 (all done)
attempt_completion: "Feature <n> complete. All 8 steps and 8 commits done."
```
```bash
# 3. Git — final commit + merge
git add .
git commit \
  -m "chore: Step 8 - Integration" \
  -m "Integrated. Full test suite passes. CHANGELOG updated." \
  -m "Workflow: <feature> | Step: 8/8 | Task ID: <id>"
git push origin feature/<slug>

# Merge feature → develop (Git Flow)
git checkout develop
git merge --no-ff feature/<slug> \
  -m "merge: feature/<slug> into develop"
git push origin develop

# Cleanup
git push origin --delete feature/<slug>
git branch -d feature/<slug>

# Verify
git log --oneline --graph -10
```

---

## Feature Branch Commit History (expected)

After Step 8, `git log --oneline feature/<slug>` should show exactly 8 commits:

```
abc1234 chore: Step 8 - Integration
def5678 refactor: Step 7 - Code Review
ghi9012 test: Step 6 - Testing
jkl3456 docs: Step 5 - Documentation
mno7890 feat: Step 4 - Implementation
pqr1234 docs: Step 3 - Function Tree
stu5678 docs: Step 2 - Data Modeling
vwx9012 docs: Step 1 - Requirement Analysis
```
