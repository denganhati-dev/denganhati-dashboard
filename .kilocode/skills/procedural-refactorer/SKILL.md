# SKILL: Procedural Refactorer

## Purpose
Refactor code that is too complex, too long, or too deeply nested into
small, focused procedural functions that are easy to read and test.

## Trigger
- Function exceeds 50 lines
- Nesting deeper than 3 levels
- Multi-step logic packed into a single function
- Code is hard to test because it is too tightly coupled

## Steps

1. **Identify logical blocks** inside the problematic function
2. **Name each block** with a descriptive verb that explains its purpose
3. **Extract** each block into a separate helper function
4. **Verify** the signature: pass required state as params, return results
5. **Replace** original code with a function call
6. **Test** that behavior is identical before and after refactoring

## Pattern: Extract Helper

```python
# BEFORE
def process_payment(order: Order, payment: Payment) -> Result:
    # validation (15 lines)
    if not order.items:
        return error("Empty order")
    if payment.amount <= 0:
        return error("Invalid amount")
    # ... more validation

    # calculate total (20 lines)
    subtotal = sum(item.price * item.qty for item in order.items)
    discount = calculate_discount(order.coupon, subtotal)
    # ...

    # charge (25 lines)
    # ...

# AFTER
def validate_payment_request(order: Order, payment: Payment) -> str | None:
    """Return error message or None if valid."""
    if not order.items: return "Empty order"
    if payment.amount <= 0: return "Invalid amount"
    return None

def calculate_order_total(order: Order) -> float:
    subtotal = sum(item.price * item.qty for item in order.items)
    return apply_discount(subtotal, order.coupon)

def charge_payment_gateway(gateway, amount: float, token: str) -> Result:
    ...

def process_payment(gateway, order: Order, payment: Payment) -> Result:
    error = validate_payment_request(order, payment)
    if error: return Result.fail(error)
    total = calculate_order_total(order)
    return charge_payment_gateway(gateway, total, payment.token)
```

## Pattern: Early Return (Flatten Nesting)

```typescript
// BEFORE (4 levels of nesting)
function processUser(user: User) {
  if (user) {
    if (user.active) {
      if (user.verified) {
        sendWelcomeEmail(user);
      }
    }
  }
}

// AFTER (guard clauses — max 1 level)
function processUser(user: User): void {
  if (!user) return;
  if (!user.active) return;
  if (!user.verified) return;
  sendWelcomeEmail(user);
}
```
