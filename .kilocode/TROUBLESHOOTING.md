# Troubleshooting Guide — Procedural Programming v3

---

## 🔍 Issue Index

| Issue | Skill | Quick Fix |
|-------|-------|-----------|
| Function > 50 lines | Procedural Refactorer | Extract helper functions |
| Nesting > 3 levels | Procedural Refactorer | Early return + helpers |
| Global variable dependency | State Decoupler | Explicit parameters |
| OOP detected (own code) | — | Separate data & behavior |
| OOP from third-party library | — | Not an issue — keep our code procedural |
| Missing documentation | Doxygen Generator | Generate complete docs |
| Tests failing | V-Model Tester | Check boundary conditions |
| Unclear requirements | — | Use `ask_followup_question` |
| Module too large | — | Split into sub-modules |
| Unfamiliar tech/library | Stack Researcher | Research first via browsermcp |
| Task CLI: database not found | Task Manager Ops | Run `[task] init` in project root |
| Task CLI: lost task IDs | Task Manager Ops | Run `[task] list --tree` |
| Task CLI: wrong status | Task Manager Ops | Use `[task] complete <ID> --status <s>` |

---

## Function Too Long (> 50 Lines)

**Symptoms:** Function is hard to understand, contains multiple responsibilities

**Solution:**
1. Identify logical blocks inside the function
2. Name each block with a descriptive verb
3. Extract each block into a separate helper function
4. Replace original code with a function call

```python
# BEFORE (too long)
def process_order(order_data: dict) -> dict:
    # 80 lines: validation, discount, stock update, email...

# AFTER (decomposed)
def validate_order(order_data: dict) -> bool: ...
def calculate_order_total(items: list, discount: float) -> float: ...
def update_inventory(db, items: list) -> bool: ...
def send_confirmation_email(mailer, order_id: int) -> bool: ...

def process_order(db, mailer, order_data: dict) -> dict:
    if not validate_order(order_data):
        return build_error_response("Invalid order")
    total = calculate_order_total(order_data['items'], order_data['discount'])
    update_inventory(db, order_data['items'])
    send_confirmation_email(mailer, order_data['id'])
    return build_success_response(total)
```

**Skill:** `procedural-refactorer`

---

## Deep Nesting (> 3 Levels)

**Symptoms:** Code indented more than 3 levels, logic flow is hard to trace

**Solution:** Guard clauses (early return) + extract nested blocks

```typescript
// BEFORE (4 levels)
function processItems(items: Item[]) {
  for (const item of items) {
    if (item.active) {
      for (const variant of item.variants) {
        if (variant.stock > 0) {
          applyDiscount(variant);
        }
      }
    }
  }
}

// AFTER (max 2 levels)
function applyDiscountIfAvailable(variant: Variant): void {
  if (variant.stock <= 0) return;
  applyDiscount(variant);
}
function processActiveItem(item: Item): void {
  if (!item.active) return;
  item.variants.forEach(applyDiscountIfAvailable);
}
function processItems(items: Item[]): void {
  items.forEach(processActiveItem);
}
```

**Skill:** `procedural-refactorer`

---

## Global Variable Dependency

**Symptoms:** Function accesses global variables, hidden dependencies, hard to test

**Solution:** Create a state struct/dict, pass it as an explicit parameter

```php
// BEFORE
$db = null;
function get_user(int $user_id): array {
    global $db;   // FORBIDDEN
    return query_user($db, $user_id);
}

// AFTER
function make_app_state(\PDO $db): array {
    return ['db' => $db, 'cache' => []];
}
function get_user(array $state, int $user_id): ?array {
    return query_user($state['db'], $user_id);
}
```

**Skill:** `state-decoupler`

---

## OOP Detected in Own Code

**Solution:** Separate data (struct/dataclass) from behavior (standalone functions)

```python
# BEFORE (FORBIDDEN)
class UserService:
    def __init__(self, db): self.db = db
    def create(self, name, email): ...

# AFTER (procedural)
@dataclass
class UserRecord:   # data-only
    name: str
    email: str

def create_user(db, user: UserRecord) -> int: ...
```

---

## OOP from Third-Party Library (NOT an issue)

```typescript
// ALLOWED — Express is OOP, but our handlers are procedural functions
const app = express();
app.get('/users', async (req, res) => {
  const users = await fetchAllUsers(db);   // logic in standalone function
  res.json(users);
});
```

---

## Missing Documentation

```python
# Python
def calculate_tax(price: float, rate: float) -> float:
    """
    Calculate tax amount from price and tax rate.

    Args:
        price: Base price (must be >= 0)
        rate: Tax rate between 0.0 and 1.0

    Returns:
        Tax amount to be paid

    Raises:
        ValueError: If price < 0 or rate outside 0–1
    """
```

**Skill:** `doxygen-docstring-generator`

---

## Tests Failing / Low Coverage

**Required test categories:**
- **Boundary Values:** min, max, just inside/outside limit
- **Path Tests:** all if/else/switch branches
- **Equivalence Partitions:** valid vs invalid input classes
- **Error Paths:** null/undefined, empty, wrong type

```python
def test_calculate_tax_boundaries():
    assert calculate_tax(0.0, 0.1) == 0.0
    assert calculate_tax(100.0, 0.0) == 0.0
    assert calculate_tax(100.0, 1.0) == 100.0

def test_calculate_tax_invalid():
    with pytest.raises(ValueError): calculate_tax(-1.0, 0.1)
    with pytest.raises(ValueError): calculate_tax(100.0, 1.1)
```

**Skill:** `v-model-tester`

---

## Task CLI Issues

### "database not found" error
```bash
.kilocode/task_manager/task init
```
Run this in the **project root directory**, not inside `.kilocode/`.

### Binary not executable (Linux/macOS)
```bash
chmod +x .kilocode/task_manager/task
```

### Lost task IDs between sessions
```bash
.kilocode/task_manager/task list --tree        # see all IDs
.kilocode/task_manager/task list --tag step-4  # find step by tag
.kilocode/task_manager/task list --search "Step 4"
```

### Step marked done by mistake
```bash
.kilocode/task_manager/task complete <ID> --status in-progress  # revert to in-progress
```

### Step accidentally skipped
```bash
.kilocode/task_manager/task complete <SKIPPED_ID> --status cancelled  # cancel the skipped step
# Document why in description
.kilocode/task_manager/task edit <SKIPPED_ID> --description "Skipped: reason"
```

---

## Quick Fix Table

| Problem | Command to AI |
|---------|---------------|
| Function too long | "Apply procedural refactorer to this function" |
| Global variables | "Use state decoupler" |
| Need tests | "Create v-model tests for this module" |
| Need docs | "Generate documentation for all functions" |
| Unfamiliar tech | "Research [tech name] before implementing" |
| Code too nested | "Flatten nesting using early return pattern" |
| Task CLI state wrong | "Check and fix task CLI state" |
