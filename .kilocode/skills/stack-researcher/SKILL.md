# SKILL: Stack Researcher

## Purpose
Research unfamiliar technologies, frameworks, or libraries before
starting implementation. Prevents incorrect code due to wrong assumptions.

## Trigger
- A new or unfamiliar tech stack is mentioned
- Brainstorm mode is evaluating technology options
- A library to be used has never been used before
- User mentions a framework that is not recognized

## Steps

1. **Identify** what needs to be researched (framework, library, API, pattern)
2. **Read the official documentation** using `browsermcp`
3. **Research the repository** using `deepwiki` for real-world usage examples
4. **Use `sequential-thinking`** for complex multi-option analysis
5. **Identify** usage patterns compatible with the procedural approach
6. **Document** findings before starting implementation
7. **Build a small proof-of-concept** if needed

## Research Output Format

```markdown
## Research: [Technology Name]

### Overview
[Brief description of the technology]

### Installation
[Install command]

### Basic Pattern (Procedural-Compatible)
[Basic usage example aligned with our procedural approach]

### Compatibility with Procedural Approach
- ✅ Parts that can be used procedurally
- ⚠️ OOP parts that are unavoidable (third-party — acceptable)
- ❌ Parts that should be avoided

### Recommendation
[Recommendation based on research]
```

## Example: Researching a New Framework

```
User: "I want to use Fastify for a Node.js API"

Stack Researcher:
1. browsermcp → https://fastify.dev/docs/latest/
2. deepwiki → fastify/fastify repository
3. Finding: Fastify uses a plugin system and route handlers
4. Analysis: route handlers can be plain procedural functions
5. Output: Fastify setup example using procedural pattern
```

## MCP Tools Used

| Tool | Usage |
|------|-------|
| `browsermcp` | Read official docs, tutorials |
| `deepwiki` | Research GitHub repositories, real code examples |
| `sequential-thinking` | Analyze and compare technology options |
