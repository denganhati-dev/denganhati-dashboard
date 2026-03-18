# SKILL: State Decoupler

## Purpose
Eliminate dependencies on global variables by converting implicit state
into explicit parameters that are passed to functions.

## Trigger
- Function uses the `global` keyword (Python)
- Function implicitly accesses variables from an outer scope
- Related state is scattered across multiple global variables
- Function is hard to test because it depends on external state

## Steps

1. **Identify** all global variables accessed by the function
2. **Group** related variables into a single state dict/dataclass/struct
3. **Update the function signature** — add state as the first parameter
4. **Update return value** if the function modifies state — return modified state
5. **Update callers** to pass state explicitly
6. **Remove** global declarations

## Pattern: Python

```python
# BEFORE
db_conn = None
cache = {}
config = {}

def get_user(user_id: int) -> dict:
    global db_conn, cache          # hidden dependency
    if user_id in cache:
        return cache[user_id]
    user = db_conn.query(f"SELECT * FROM users WHERE id = {user_id}")
    cache[user_id] = user
    return user

# AFTER
from dataclasses import dataclass, field

@dataclass
class AppState:
    db_conn: object
    cache: dict = field(default_factory=dict)
    config: dict = field(default_factory=dict)

def get_user(state: AppState, user_id: int) -> dict | None:
    """
    Retrieve a user from cache or database.

    Args:
        state: Application state (db + cache)
        user_id: ID of the user to retrieve

    Returns:
        User dict or None if not found
    """
    if user_id in state.cache:
        return state.cache[user_id]
    user = query_user_by_id(state.db_conn, user_id)
    if user:
        state.cache[user_id] = user
    return user
```

## Pattern: PHP

```php
// BEFORE
$db = null;
$config = [];

function get_user(int $user_id): array {
    global $db, $config;           // hidden dependency
    return query_user($db, $user_id);
}

// AFTER
function make_app_state(\PDO $db, array $config): array {
    return ['db' => $db, 'config' => $config, 'cache' => []];
}

function get_user(array &$state, int $user_id): ?array {
    if (isset($state['cache'][$user_id])) {
        return $state['cache'][$user_id];
    }
    $user = query_user($state['db'], $user_id);
    if ($user) {
        $state['cache'][$user_id] = $user;
    }
    return $user;
}
```

## Pattern: TypeScript

```typescript
// BEFORE
let dbPool: Pool;
let redisClient: Redis;

async function getUser(userId: number): Promise<User | null> {
  // implicit dependency on dbPool and redisClient
  const cached = await redisClient.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  return queryUserById(dbPool, userId);
}

// AFTER
interface AppContext {
  db: Pool;
  redis: Redis;
}

async function getUser(ctx: AppContext, userId: number): Promise<User | null> {
  const cached = await ctx.redis.get(`user:${userId}`);
  if (cached) return JSON.parse(cached);
  return queryUserById(ctx.db, userId);
}
```
