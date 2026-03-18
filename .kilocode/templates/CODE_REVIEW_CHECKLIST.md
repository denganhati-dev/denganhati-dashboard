# Code Review Checklist — Procedural Programming v3

> Use this checklist at Step 7 (Code Review).
> Copy to PR description or TODO.md for tracking.

---

## 🔴 Critical (all must pass)

### No OOP in Own Code
- [ ] No classes with methods/behavior in code we wrote
- [ ] No inheritance or polymorphism
- [ ] Data structures (dataclass/interface/array) contain no business logic methods
- [ ] Note: using objects from third-party libraries is **allowed**

### Single Responsibility
- [ ] Every function does exactly ONE thing
- [ ] No function exceeds 50 lines
- [ ] Function names accurately reflect what they do

### State Management
- [ ] No hidden global variables
- [ ] State is passed explicitly via function arguments
- [ ] Functions that modify state use return values or pointer/reference

### Nesting
- [ ] No nesting deeper than 3 levels
- [ ] Guard clauses / early returns used to reduce nesting

---

## 🟡 Important (must pass >90%)

### Documentation
- [ ] All public functions have docstring/JSDoc/PHPDoc
- [ ] @param with type and direction documented
- [ ] @return documented
- [ ] Side effects (I/O, DB write, etc.) mentioned
- [ ] Pre/post conditions for complex functions

### Naming Convention
- [ ] Functions use descriptive verbs
- [ ] Consistent with language naming convention (snake_case / camelCase)
- [ ] Constants use UPPER_SNAKE_CASE
- [ ] No ambiguous names (a, b, tmp, data2)

### Modular Structure
- [ ] Related functions grouped in the appropriate module
- [ ] No file exceeds 400–500 lines
- [ ] Module dependencies are minimal and documented
- [ ] Entry point is dispatcher-only — no business logic

---

## 🟢 Good Practice (recommended)

### Code Quality
- [ ] No dead code (unused functions/variables)
- [ ] No duplicate logic — use helper functions
- [ ] Error handling consistent across modules
- [ ] Magic numbers replaced with named constants

### Testing
- [ ] Unit tests present for all public functions
- [ ] Coverage >80%
- [ ] Boundary values covered
- [ ] Error paths tested
- [ ] All tests pass

### Python Specifics
- [ ] Complete type hints on all parameters and return types
- [ ] Docstrings use consistent format (Google style)
- [ ] `@dataclass` used for data structures (no logic methods)
- [ ] Imports organized (stdlib → third-party → local)

### JavaScript/TypeScript Specifics
- [ ] TypeScript strict mode enabled
- [ ] `type` / `interface` used instead of classes for data
- [ ] Pure functions preferred
- [ ] Async/await used consistently (not mixed with callbacks)

### PHP Specifics
- [ ] Namespaces used for modularity
- [ ] PHP 8+ type hints on all parameters and return types
- [ ] Associative arrays used as data structures
- [ ] `require`/`include` used for modular file structure

---

## Review Summary

```
Reviewer: _______________
Date: _______________
Module/Feature: _______________

Critical Issues: ___
Important Issues: ___
Suggestions: ___

Status: [ ] Approved  [ ] Approved with minor fixes  [ ] Changes Required

Notes:
```
