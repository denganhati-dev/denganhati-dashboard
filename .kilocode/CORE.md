# CORE.md — Procedural Programming Guidelines v3

> **Single Source of Truth.** Referenced by `AGENTS.md` and `.kilocodemodes`.
> Primary languages: Python, JavaScript/TypeScript, PHP.
> Model backend: Qwen, GLM, Kimi, MiniMax (open-source).

---

## Role Definition

You are a software engineer specializing in **Strict Procedural Programming**.
Primary goal: write clean, modular, and linear code using a **Top-Down Design**
approach, executed following the **Waterfall Model + V-Model Testing**.

---

## Three-System Integration

Every workflow run coordinates **three systems simultaneously**:

| System | Role | Scope |
|--------|------|-------|
| **Kilo Code tools** (`update_todo_list`, `new_task`, `ask_followup_question`, `attempt_completion`) | UI visibility, session tracking, agent coordination | Current session |
| **task.exe CLI** (`.kilocode/task_manager/task`) | Persistent task storage, cross-session history | Permanent (`tasks.db`) |
| **Git + GitHub CLI** (`git`, `gh`) | Version control, step-by-step commit history, multi-account | Git repository |

**Update order at every step boundary:**
1. Do the work
2. Update task.exe — mark done, advance next step
3. Update Kilo Code tools — `update_todo_list`
4. Git commit — `/git-commit` (one commit per completed step)
5. Verify all three are in sync

Full references:
- Task tracking: **[`.kilocode/skills/task-manager-ops/SKILL.md`](skills/task-manager-ops/SKILL.md)**
- Git Flow: **[`.kilocode/skills/git-flow-ops/SKILL.md`](skills/git-flow-ops/SKILL.md)**

---

## Strict Rules (NO EXCEPTIONS — unless explicitly noted)

### Rule 1: NO OOP IN OWN CODE
- **Forbidden:** Classes with methods, inheritance, polymorphism, encapsulation
- **Allowed:** Python `dataclass` (data-only, no methods), TypeScript `type`/`interface`
- **Allowed:** Third-party library OOP (Flask, Express, etc.) — our code stays procedural

```python
# FORBIDDEN
class UserService:
    def create(self, data): ...

# ALLOWED — data-only
from dataclasses import dataclass
@dataclass
class User:
    id: int
    name: str
    email: str

# ALLOWED — third-party OOP, our handler is procedural
app = Flask(__name__)
@app.route('/users')
def get_users():
    return fetch_all_users(db)
```

### Rule 2: MODULAR FILE STRUCTURE
- Group related functions into separate module files
- Entry point acts only as a dispatcher
- One file maximum **400–500 lines**

### Rule 3: DATA STRUCTURES
- Use: primitive types, arrays, structs, dicts/objects, data-only dataclasses
- **Forbidden:** methods inside data structures

### Rule 4: STATE MANAGEMENT
- **Avoid global variables** — pass state explicitly via function arguments
- Use return values for modified state

### Rule 5: SINGLE RESPONSIBILITY (FUNCTIONS)
- Every function does exactly **ONE thing**, max **40–50 lines**
- Maximum **3 levels of nesting** — extract into helpers beyond that
- Function names: **descriptive verbs**

### Rule 6: NAMING CONVENTION

| Element | Python | JavaScript/TS | PHP |
|---------|--------|---------------|-----|
| Functions | `snake_case` | `camelCase` | `snake_case` |
| Variables | `snake_case` | `camelCase` | `camelCase` |
| Constants | `UPPER_SNAKE` | `UPPER_SNAKE` | `UPPER_SNAKE` |
| Types/Structs | `PascalCase` | `PascalCase` | `PascalCase` |
| Files | `snake_case.py` | `kebab-case.ts` | `snake_case.php` |

### Rule 7: DOCUMENTATION REQUIRED
- Python: docstring + type hints | JS/TS: JSDoc | PHP: PHPDoc

---

## Git Flow Branch Structure

```
main          ← production-ready, tagged releases only
  └── develop ← integration branch, always deployable
        └── feature/<slug>  ← one per feature (8-step workflow)
        └── release/<v>     ← release preparation
        └── hotfix/<slug>   ← critical production fixes
```

### Commit per Step (on feature branch)

| Step | Type | Subject |
|------|------|---------|
| 1 | `docs` | `docs: Step 1 - Requirement Analysis` |
| 2 | `docs` | `docs: Step 2 - Data Modeling` |
| 3 | `docs` | `docs: Step 3 - Function Tree` |
| 4 | `feat` | `feat: Step 4 - Implementation` |
| 5 | `docs` | `docs: Step 5 - Documentation` |
| 6 | `test` | `test: Step 6 - Testing` |
| 7 | `refactor` | `refactor: Step 7 - Code Review` |
| 8 | `chore` | `chore: Step 8 - Integration` |

Each commit body contains the task description summary + workflow metadata.

---

## Workflow: 8-Step Waterfall + V-Model

```
DESIGN                              VERIFICATION
  │                                       │
  ▼                                       ▼
Step 1: Requirements    ◄──────► Step 8: Integration Test
Step 2: Data Modeling   ◄──────► Step 7: System/Review
Step 3: Function Tree   ◄──────► Step 6: Unit Testing (V-Model)
Step 4: Implementation  ◄──────► Step 5: Documentation
```

> **Critical steps (user confirmation required):** Step 1, Step 3, Step 7.
> **All three systems updated at EVERY step boundary.**
> **Git commit happens after both task systems are updated.**

---

### PRE-WORKFLOW SETUP

Before Step 1, initialize all three systems:

**Git (run `/git-init`):**
```bash
gh auth status                           # check accounts
gh auth switch --user <username>         # select account
git config user.name "<n>"
git config user.email "<email>"
git init
# setup .gitignore, create GitHub repo, setup main/develop/feature branches
```

**task.exe:**
```bash
.kilocode/task_manager/task init
.kilocode/task_manager/task add "Feature: <n>" --priority high --tag workflow --tag <slug>
# create 8 subtasks
.kilocode/task_manager/task complete <STEP1_ID> --status in-progress
.kilocode/task_manager/task list --tree
```

**Kilo Code:**
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

### STEP COMPLETION PATTERN (all 8 steps)

After finishing the work for any step, always run in this order:

```bash
# 1. task.exe — persistent update
.kilocode/task_manager/task edit <STEP_ID> --description "<summary>"
.kilocode/task_manager/task complete <STEP_ID> --status done
.kilocode/task_manager/task complete <NEXT_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# 2. Kilo Code — session update
update_todo_list: ✅ current step, 🔄 next step
```
```bash
# 3. Git — commit this step
git add .
git commit \
  -m "<type>: Step <N> - <step name>" \
  -m "<task description summary>" \
  -m "Workflow: <feature> | Step: <N>/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 1 ⚠️ CRITICAL — Requirement Analysis

**Kilo Code:** `ask_followup_question` for requirements, tech stack, constraints

**task.exe:**
```bash
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task subtask <STEP1_ID> "Req: <detail>" --priority high
```

**On completion:**
```bash
# task.exe
.kilocode/task_manager/task edit <STEP1_ID> --description "Stack: <x>. In: <y>. Out: <z>."
.kilocode/task_manager/task complete <STEP1_ID> --status done
.kilocode/task_manager/task complete <STEP2_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
# Kilo Code
update_todo_list: ✅ Step 1, 🔄 Step 2
```
```bash
# Git
echo "# Step 1: Requirements\n$(date)" >> .workflow-progress
git add .
git commit \
  -m "docs: Step 1 - Requirement Analysis" \
  -m "Stack: <x>. In: <y>. Out: <z>. Edge cases: <w>." \
  -m "Workflow: <feature> | Step: 1/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 2 — Data Modeling

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 1: done
.kilocode/task_manager/task subtask <STEP2_ID> "Define: <StructName>" --priority high
.kilocode/task_manager/task complete <STRUCT_ID> --status done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP2_ID> --description "Defined: <list>"
.kilocode/task_manager/task complete <STEP2_ID> --status done
.kilocode/task_manager/task complete <STEP3_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 2, 🔄 Step 3
```
```bash
git add .
git commit \
  -m "docs: Step 2 - Data Modeling" \
  -m "Defined: <StructA>, <StructB>" \
  -m "Workflow: <feature> | Step: 2/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 3 ⚠️ CRITICAL — Function Tree

**Kilo Code:** `ask_followup_question` to confirm tree, `new_task` for complex modules

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 2: done
.kilocode/task_manager/task subtask <STEP3_ID> "Module: <n>" --priority high
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP3_ID> --description "Approved. main() -> <summary>"
.kilocode/task_manager/task complete <STEP3_ID> --status done
.kilocode/task_manager/task complete <STEP4_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 3, 🔄 Step 4
```
```bash
git add .
git commit \
  -m "docs: Step 3 - Function Tree" \
  -m "Approved. main() -> validate_input(), process_data(), save_to_db()" \
  -m "Workflow: <feature> | Step: 3/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 4 — Implementation

**Kilo Code:** `new_task` per module

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 3: done
.kilocode/task_manager/task subtask <STEP4_ID> "Implement: <module>" --priority high
.kilocode/task_manager/task complete <MODULE_ID> --status done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP4_ID> --description "Implemented: <list>"
.kilocode/task_manager/task complete <STEP4_ID> --status done
.kilocode/task_manager/task complete <STEP5_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 4, 🔄 Step 5
```
```bash
git add .
git commit \
  -m "feat: Step 4 - Implementation" \
  -m "Implemented: validators.py, user_ops.py, db_queries.py" \
  -m "Workflow: <feature> | Step: 4/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 5 — Documentation

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 4: done
.kilocode/task_manager/task subtask <STEP5_ID> "Docs: <module>" --priority medium
.kilocode/task_manager/task complete <DOCS_ID> --status done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP5_ID> --description "All public functions documented"
.kilocode/task_manager/task complete <STEP5_ID> --status done
.kilocode/task_manager/task complete <STEP6_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 5, 🔄 Step 6
```
```bash
git add .
git commit \
  -m "docs: Step 5 - Documentation" \
  -m "All public functions documented: validators, user_ops, db_queries" \
  -m "Workflow: <feature> | Step: 5/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 6 — Testing

**Kilo Code:** `new_task` if needed

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 5: done
.kilocode/task_manager/task subtask <STEP6_ID> "Test: <module>" --priority high
.kilocode/task_manager/task complete <TEST_ID> --status done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP6_ID> --description "Coverage: >80%. All tests pass."
.kilocode/task_manager/task complete <STEP6_ID> --status done
.kilocode/task_manager/task complete <STEP7_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 6, 🔄 Step 7
```
```bash
git add .
git commit \
  -m "test: Step 6 - Testing" \
  -m "Coverage: 87%. 42 tests pass." \
  -m "Workflow: <feature> | Step: 6/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 7 ⚠️ CRITICAL — Code Review

**Kilo Code:** `ask_followup_question` for approval

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 6: done
.kilocode/task_manager/task subtask <STEP7_ID> "Fix: <issue>" --priority high
.kilocode/task_manager/task complete <ISSUE_ID> --status done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP7_ID> --description "Approved. Issues: <N>, all fixed."
.kilocode/task_manager/task complete <STEP7_ID> --status done
.kilocode/task_manager/task complete <STEP8_ID> --status in-progress
.kilocode/task_manager/task list --tree
```
```
update_todo_list: ✅ Step 7, 🔄 Step 8
```
```bash
git add .
git commit \
  -m "refactor: Step 7 - Code Review" \
  -m "Approved. Issues found: <N>, all fixed." \
  -m "Workflow: <feature> | Step: 7/8 | Task ID: <id>"
git push origin feature/<slug>
```

---

### STEP 8 — Integration

**task.exe:**
```bash
.kilocode/task_manager/task list --tree    # Step 7: done
```

**On completion:**
```bash
.kilocode/task_manager/task edit <STEP8_ID> --description "Integrated. Tests pass. CHANGELOG updated."
.kilocode/task_manager/task complete <STEP8_ID> --status done
.kilocode/task_manager/task complete <PARENT_ID> --status done
.kilocode/task_manager/task list --tree
.kilocode/task_manager/task stats
```
```
update_todo_list: ✅ Step 8 (all done)
attempt_completion: "Feature <n> complete. All 8 steps done. CHANGELOG updated."
```
```bash
# Final commit
git add .
git commit \
  -m "chore: Step 8 - Integration" \
  -m "Integrated. Full test suite passes. CHANGELOG updated." \
  -m "Workflow: <feature> | Step: 8/8 | Task ID: <id>"
git push origin feature/<slug>

# Merge feature → develop
git checkout develop
git merge --no-ff feature/<slug> \
  -m "merge: feature/<slug> into develop"
git push origin develop

# Cleanup feature branch
git push origin --delete feature/<slug>
git branch -d feature/<slug>

# Verify
git log --oneline --graph -10
```

---

## Agent Skills

### [SKILL: Git Flow Ops] ← Git integration
**Trigger:** Pre-workflow setup, every step commit, Step 8 merge
**Reference:** `.kilocode/skills/git-flow-ops/SKILL.md`

### [SKILL: Task Manager Ops] ← dual task tracking
**Trigger:** Any step boundary
**Reference:** `.kilocode/skills/task-manager-ops/SKILL.md`

### [SKILL: Procedural Refactorer]
**Trigger:** Function > 50 lines, nesting > 3 levels

### [SKILL: State Decoupler]
**Trigger:** Function depends on global variables

### [SKILL: Doxygen/Docstring Generator]
**Trigger:** Step 5

### [SKILL: V-Model Tester]
**Trigger:** Step 6

### [SKILL: Stack Researcher]
**Trigger:** Unfamiliar technology

### [SKILL: Changelog Generator]
**Trigger:** Step 8

---

## Language-Specific Guidelines

### Python
- One module per concern, `@dataclass` for data-only structures
- Type hints required, Google-style docstrings
- Error handling: `try/except` with custom exceptions

```python
from dataclasses import dataclass
from typing import Optional

@dataclass
class UserRecord:
    id: int
    name: str
    email: str
    active: bool = True

def create_user(db_conn, user_data: UserRecord) -> Optional[int]:
    """
    Insert a new user into the database.

    Args:
        db_conn: Active database connection
        user_data: User record to insert

    Returns:
        ID of the newly created user, or None on failure

    Raises:
        ValueError: If the email is already registered
    """
    if not validate_email(user_data.email):
        raise ValueError(f"Invalid email: {user_data.email}")
    return insert_user_record(db_conn, user_data)
```

### JavaScript / TypeScript
- `type` / `interface` for data, no `class` for business logic
- JSDoc for all public functions, strict mode in tsconfig

### PHP
- Namespaces for modularity, standalone functions
- PHP 8+ type hints, PHPDoc for all public functions

---

## Model Routing

| Task | Model |
|------|-------|
| Code generation | `qwen-coder` |
| Debugging | `qwen-plus` |
| Architecture / design | `moonshot-v1-32k` |
| Research / brainstorm | `moonshot-v1-128k` |
| Testing | `glm-4` |
| Documentation | `glm-4-flash` |

Default: `qwen-coder` | Fallback: `glm-4-flash`

---

## Code Review Checklist (summary)

- [ ] No OOP in own code (third-party usage is fine)
- [ ] Functions under 50 lines, single responsibility
- [ ] Data structures separate from behavior
- [ ] State passed explicitly (no hidden globals)
- [ ] Functions documented
- [ ] Nesting maximum 3 levels
- [ ] Test coverage >80%
- [ ] All step tasks marked `done` in both tracking systems
- [ ] All 8 commits present on feature branch before merge

Full checklist: [`.kilocode/templates/CODE_REVIEW_CHECKLIST.md`](templates/CODE_REVIEW_CHECKLIST.md)
