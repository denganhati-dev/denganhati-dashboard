# SKILL: Changelog Generator

## Purpose
Generate or update CHANGELOG.md at Step 8 (Integration) after a
feature or fix has been successfully integrated.

## Trigger
- Step 8 (Integration) is complete
- A hotfix or patch is deployed
- A new release is being prepared

## Format: Keep a Changelog

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

## [1.2.0] - 2025-03-18

### Added
- `calculate_bulk_discount()` function for bulk purchase discounts
- `export_ops.py` module for exporting data to CSV and Excel
- Unit tests for all functions in `order_ops.py` (92% coverage)

### Changed
- `process_order()` split into 4 helper functions (refactor)
- `validate_payment()` now accepts multiple payment methods

### Fixed
- Bug: `get_user_orders()` crashed when user has no orders
- Bug: Negative discount when coupon value exceeded order total

### Removed
- Deprecated function `old_calculate_total()` removed

## [1.1.0] - 2025-03-01
...
```

## Entry Categories

| Category | When to Use |
|----------|-------------|
| **Added** | New features, new functions, new modules |
| **Changed** | Changes to existing features, refactoring |
| **Deprecated** | Features to be removed in a future version |
| **Removed** | Features or functions that have been deleted |
| **Fixed** | Bug fixes |
| **Security** | Security vulnerability fixes |

## Generation Steps

1. Collect all changes from Steps 4–8 of the workflow
2. Categorize each change (Added/Changed/Fixed/Removed)
3. Write clear entries: mention the function/module name that changed
4. Add under `## [Unreleased]` or create a new versioned section
5. Use clear, actionable past tense
