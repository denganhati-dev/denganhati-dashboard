# SKILL: V-Model Tester

## Purpose
Create comprehensive unit tests based on V-Model methodology,
focused on function boundaries, paths, and equivalence partitions.

## Trigger
- Step 6 (Testing) in the workflow
- A new function has been implemented
- A bug is found that is not covered by existing tests

## Required Test Categories

### 1. Boundary Value Analysis (BVA)
Test exactly at the boundary, just inside, and just outside the limit.

```python
# Function: calculate_discount(price: float, rate: float) -> float
# Constraints: price >= 0, 0.0 <= rate <= 1.0

def test_calculate_discount_boundary_price():
    assert calculate_discount(0.0, 0.1) == 0.0       # lower bound: price = 0
    assert calculate_discount(0.01, 0.1) == 0.001    # just above lower bound
    assert calculate_discount(999999.99, 0.1) > 0    # large value

def test_calculate_discount_boundary_rate():
    assert calculate_discount(100.0, 0.0) == 0.0     # minimum rate
    assert calculate_discount(100.0, 1.0) == 100.0   # maximum rate
    assert calculate_discount(100.0, 0.5) == 50.0    # midpoint value
```

### 2. Path Testing
Test all if/else/switch/try-catch branches.

```typescript
// Function with multiple branches
function categorizeAge(age: number): string {
  if (age < 0) return 'invalid';
  if (age < 13) return 'child';
  if (age < 18) return 'teen';
  if (age < 65) return 'adult';
  return 'senior';
}

describe('categorizeAge', () => {
  it('returns invalid for negative age', () => expect(categorizeAge(-1)).toBe('invalid'));
  it('returns child for age 0', () => expect(categorizeAge(0)).toBe('child'));
  it('returns child for age 12', () => expect(categorizeAge(12)).toBe('child'));
  it('returns teen for age 13', () => expect(categorizeAge(13)).toBe('teen'));
  it('returns teen for age 17', () => expect(categorizeAge(17)).toBe('teen'));
  it('returns adult for age 18', () => expect(categorizeAge(18)).toBe('adult'));
  it('returns adult for age 64', () => expect(categorizeAge(64)).toBe('adult'));
  it('returns senior for age 65', () => expect(categorizeAge(65)).toBe('senior'));
});
```

### 3. Equivalence Partitioning
Group inputs into valid and invalid partitions, test one representative per partition.

```php
// PHP — using PHPUnit
class ValidateEmailTest extends TestCase {
    // Valid partitions
    public function test_valid_standard_email(): void {
        $this->assertTrue(validate_email('user@example.com'));
    }
    public function test_valid_email_with_dots(): void {
        $this->assertTrue(validate_email('user.name@sub.domain.com'));
    }

    // Invalid partitions
    public function test_invalid_missing_at(): void {
        $this->assertFalse(validate_email('userexample.com'));
    }
    public function test_invalid_missing_domain(): void {
        $this->assertFalse(validate_email('user@'));
    }
    public function test_invalid_empty_string(): void {
        $this->assertFalse(validate_email(''));
    }
    public function test_invalid_whitespace_only(): void {
        $this->assertFalse(validate_email('   '));
    }
}
```

### 4. Error Path Testing
Verify that functions throw the correct exception.

```python
import pytest

def test_create_user_raises_on_duplicate_email(db_fixture):
    existing_user = UserRecord(id=1, name="Alice", email="alice@test.com")
    create_user(db_fixture, existing_user)

    duplicate_user = UserRecord(id=2, name="Bob", email="alice@test.com")
    with pytest.raises(ValueError, match="email already exists"):
        create_user(db_fixture, duplicate_user)

def test_calculate_discount_raises_on_negative_price():
    with pytest.raises(ValueError):
        calculate_discount(-100.0, 0.1)
```

## Test Suite Template

```python
# Python — pytest
class TestModuleName:
    """Test suite for module_name.py"""

    # --- Setup ---
    @pytest.fixture
    def sample_data(self):
        return {...}  # test data

    # --- Happy Path ---
    def test_function_normal_case(self, sample_data):
        result = function_name(sample_data)
        assert result == expected_value

    # --- Boundary Values ---
    def test_function_minimum_input(self):
        ...

    def test_function_maximum_input(self):
        ...

    # --- Error Paths ---
    def test_function_raises_on_invalid_input(self):
        with pytest.raises(ValueError):
            function_name(invalid_input)

    def test_function_returns_none_when_not_found(self):
        result = function_name(nonexistent_id)
        assert result is None
```

## Coverage Target

- **Minimum:** 80% line coverage
- **Recommended:** 90%+ for critical modules (auth, payment, data integrity)
- Tools: `pytest-cov` (Python), `jest --coverage` (JS/TS), PHPUnit coverage (PHP)
