# MCP Server Skill

## Overview
The MCP server (`app/src/server/index.ts`) is FORK's brain — it exposes tools and resources to Claude via stdio transport.

## Starting the Server
```bash
cd app && npm run mcp
# or: cd app && npx tsx src/server/index.ts
```
Server assumes `process.cwd()` is `app/`, resolves `projectDir` as `path.resolve(process.cwd(), "..")`.

## Tools (11)

| Tool | Purpose | Input |
|------|---------|-------|
| `get_prompt` | Retrieve prompt from registry | `{ id, variables? }` |
| `run_idea_stage` | Process idea → requirements | `{ idea, budget }` |
| `run_design_stage` | Save design spec | `{ spec: DesignSpec }` |
| `run_build_stage` | Write code files | `{ files: [{path, content}] }` |
| `run_persona_stage` | Generate user personas | `{ requirements }` |
| `read_files` | Read project files | `{ paths: string[] }` |
| `run_docker` | Execute Docker commands | `{ command, args }` |
| `grep_project` | Search file contents | `{ pattern, glob? }` |
| `list_files` | List files by glob | `{ pattern }` |
| `get_project_summary` | Full project context | `{}` |
| `run_openrouter` | Delegate to external LLM | `{ model, prompt }` |

## Resources (7)

| URI | Returns |
|-----|---------|
| `fork://identity` | FORK identity and purpose |
| `fork://project/features` | features.json contents |
| `fork://project/design` | design.json contents |
| `fork://project/requirements` | requirements.md contents |
| `fork://project/tree` | Full directory tree |
| `fork://file/{path}` | Any project file |
| `fork://project/personas` | Generated persona data |

## Server Architecture
- Transport: stdio (for Claude Code integration)
- SDK: `@modelcontextprotocol/sdk` v1.26
- Environment: `app/src/server/env.ts` (env var management)
- Guards: `app/src/server/response-guard.ts` (output sanitization)
- External LLMs: `app/src/server/openrouter.ts` (delegation)

## Patterns
- Tools map 1:1 to pipeline stages where possible
- `get_project_summary` is the go-to for full context in one call
- `read_files` has security checks (no path traversal)
- OpenRouter enables using GPT/Qwen/etc. for specific subtasks
- Response guard strips dangerous content from LLM outputs
