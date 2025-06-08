# Capacities MCP Server

This is an MCP server for the Capacities API (https://docs.capacities.io/developer/api).

## Development

- Use `bun` as the package manager
- Use `bun run dev` to start the development server
- Use `bun run lint` to check code quality and types
- Use `bun run test` to run tests
- Use `bun run build` to build for production

## API Reference

The Capacities API documentation is available at:
- Docs: https://api.capacities.io/docs/
- OpenAPI Schema: https://api.capacities.io/openapi.json

## Authentication

Set the `CAPACITIES_API_KEY` environment variable with your Capacities API token.

For development, copy `.env.example` to `.env` and add your API key:
```bash
cp .env.example .env
# Edit .env and add your API key
```

## Available Tools

- `capacities_list_spaces` - Get user's personal spaces
- `capacities_get_space_info` - Get structures and collections for a space
- `capacities_search` - Search content across spaces
  - `mode` defaults to "title" if not specified
- `capacities_save_weblink` - Save a web link to a space
  - Parameters: `titleOverwrite`, `descriptionOverwrite`, `tags`, `mdText`
- `capacities_save_to_daily_note` - Add text to today's daily note
  - `origin` only accepts "commandPalette" 
  - Use `noTimestamp: true` to skip timestamp

## Available Prompts

- `capacities-daily-summary` - Create structured daily summaries
- `capacities-research-note` - Format research findings  
- `capacities-meeting-notes` - Structure meeting notes

## Rate Limits

- `/spaces`: 5 requests per 60 seconds
- `/space-info`: 5 requests per 60 seconds  
- `/search`: 120 requests per 60 seconds
- `/save-weblink`: 10 requests per 60 seconds
- `/save-to-daily-note`: 5 requests per 60 seconds