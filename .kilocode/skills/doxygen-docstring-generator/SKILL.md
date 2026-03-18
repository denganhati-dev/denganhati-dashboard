# SKILL: Doxygen / Docstring Generator

## Purpose
Generate standard documentation for all functions in a module,
using the correct format for the language being used.

## Trigger
- Step 5 (Documentation) in the workflow
- A new module has been implemented
- Undocumented functions are found during review

## Format per Language

### Python — Google Style Docstring

```python
def calculate_order_discount(order_total: float, coupon_code: str) -> float:
    """
    Calculate the discount amount based on order total and coupon code.

    Args:
        order_total: Total order price before discount (must be >= 0)
        coupon_code: Coupon code to apply (can be empty string)

    Returns:
        Discount amount as a nominal value (not percentage).
        Returns 0.0 if the coupon is invalid or not found.

    Raises:
        ValueError: If order_total is negative

    Side Effects:
        Reads the coupons table from the database (read-only)

    Example:
        >>> calculate_order_discount(100000, "SAVE10")
        10000.0
    """
```

### JavaScript/TypeScript — JSDoc

```typescript
/**
 * Calculate the discount amount based on order total and coupon code.
 *
 * @param orderTotal - Total order price before discount (must be >= 0)
 * @param couponCode - Coupon code to apply (can be empty string)
 * @returns Discount amount as a nominal value. 0 if the coupon is invalid.
 * @throws {RangeError} If orderTotal is negative
 *
 * @example
 * const discount = calculateOrderDiscount(100000, 'SAVE10');
 * // discount === 10000
 */
async function calculateOrderDiscount(orderTotal: number, couponCode: string): Promise<number>
```

### PHP — PHPDoc

```php
/**
 * Calculate the discount amount based on order total and coupon code.
 *
 * @param float  $order_total Total order price before discount (must be >= 0)
 * @param string $coupon_code Coupon code to apply (can be empty string)
 *
 * @return float Discount amount as a nominal value. 0.0 if the coupon is invalid.
 *
 * @throws \InvalidArgumentException If order_total is negative
 *
 * @example
 * $discount = calculate_order_discount(100000, 'SAVE10'); // 10000.0
 */
function calculate_order_discount(float $order_total, string $coupon_code): float
```

## Required Elements

| Element | Required? | Notes |
|---------|-----------|-------|
| Description | Yes | One clear sentence |
| @param / Args | Yes | All parameters, type + constraint |
| @return / Returns | Yes | Type and special conditions (null case, etc.) |
| @throws / Raises | If applicable | All exceptions that can be thrown |
| Side Effects | If applicable | I/O, DB writes, external calls |
| Pre-conditions | If complex | Assumptions that must hold |
| Post-conditions | If complex | Guarantees after function runs |
| @example | Recommended | Real usage example |

## Generation Steps

1. Read the function signature (name, params, return type)
2. Read the implementation to understand behavior and side effects
3. Identify all possible exceptions
4. Write the description: one active sentence explaining WHAT it does
5. Document each param: type, constraint, and meaning
6. Document return: type and all possible values
7. Add a usage example if the function is non-trivial
