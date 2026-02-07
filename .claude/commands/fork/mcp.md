# /fork:mcp - Start MCP Server

Launch the FORK MCP server for AI agent integration.

## Usage

```
/fork:mcp                        # Start MCP server (stdio)
/fork:mcp --list                 # List available tools and resources
```

## Behavior

When user runs `/fork:mcp`:

1. **Start the MCP server**:
   ```bash
   cd C:\Users\Justin\desktop\FORK\app && npm run mcp
   ```
   This runs `tsx src/server/index.ts` with stdio transport.

2. **Report**:
   ```
   FORK MCP server running (stdio)
   Tools: 11 available
   Resources: 7 available
   Press Ctrl+C to stop
   ```

When user runs `/fork:mcp --list`:

1. **List all tools**:
   ```
   MCP Tools:
   - get_prompt          Retrieve prompt from registry
   - run_idea_stage      Process idea → requirements
   - run_design_stage    Save design spec
   - run_build_stage     Write generated code
   - read_files          Read project files
   - run_docker          Execute Docker commands
   - grep_project        Search file contents
   - list_files          List files by glob
   - get_project_summary Full project context
   - run_openrouter      Delegate to external LLMs

   MCP Resources:
   - fork://identity
   - fork://project/features
   - fork://project/design
   - fork://project/requirements
   - fork://project/tree
   - fork://file/{path}
   ```

## Notes
- Server assumes `cwd` is `app/` — always run from there
- Uses stdio transport (designed for Claude Code integration)
- Environment variables loaded from `src/server/env.ts`
- Response sanitization via `src/server/response-guard.ts`
