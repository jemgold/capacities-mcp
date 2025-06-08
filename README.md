# Capacities MCP Server

An MCP (Model Context Protocol) server for [Capacities](https://capacities.io), providing seamless integration with your knowledge management system.

## Features

This MCP server provides access to all core Capacities API endpoints:

- **List Spaces** - Get all your personal spaces
- **Space Information** - Retrieve detailed space structures and collections
- **Search Content** - Search across spaces with advanced filtering
- **Save Weblinks** - Save URLs to your spaces with metadata
- **Daily Notes** - Add content to your daily notes

## Installation

### For Claude Desktop

1. Clone this repository:
```bash
git clone https://github.com/jemgold/capacities-mcp.git
cd capacities-mcp
```

2. Install dependencies:
```bash
bun install
```

3. Build the server:
```bash
bun run build
```

4. Add to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):
```json
{
  "mcpServers": {
    "capacities": {
      "command": "node",
      "args": ["path/to/capacities-mcp/dist/server.js"],
      "env": {
        "CAPACITIES_API_KEY": "your_capacities_api_key_here"
      }
    }
  }
}
```

## Development

### Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Add your Capacities API key to `.env`:
```
CAPACITIES_API_KEY=your_api_key_here
```

3. Install dependencies:
```bash
bun install
```

### Running the Server

Start the development server with interactive mode:
```bash
bun run dev
```

For production use:
```bash
bun run start
```

To inspect the server tools and schema:
```bash
bun run inspect
```

### Testing

Run the test suite:
```bash
bun run test
```

### Code Quality

Check linting and types:
```bash
bun run lint
```

Format code:
```bash
bun run format
```

## API Reference

Get your Capacities API key from your [Capacities account settings](https://capacities.io/).

For detailed API documentation, see:
- [Capacities API Docs](https://api.capacities.io/docs/)
- [OpenAPI Schema](https://api.capacities.io/openapi.json)

## Available Tools

### `capacities_list_spaces`
Get a list of all your personal spaces.

### `capacities_get_space_info`
Get detailed information about a specific space, including structures and collections.
- **spaceId**: UUID of the space

### `capacities_search`
Search for content across your spaces with optional filtering.
- **searchTerm**: Text to search for
- **spaceIds**: Array of space UUIDs to search in
- **mode** (optional): "fullText" or "title" search mode
- **filterStructureIds** (optional): Filter by specific structure types

### `capacities_save_weblink`
Save a web link to a space with optional metadata.
- **spaceId**: UUID of the target space
- **url**: The URL to save
- **title** (optional): Custom title for the link
- **description** (optional): Description text
- **tags** (optional): Array of tags

### `capacities_save_to_daily_note`
Add markdown content to today's daily note in a space.
- **spaceId**: UUID of the target space
- **mdText**: Markdown content to add
- **origin** (optional): Origin label for the content
- **addTimestamp** (optional): Whether to include a timestamp

## Rate Limits

The Capacities API has the following rate limits:
- `/spaces`: 5 requests per 60 seconds
- `/space-info`: 5 requests per 60 seconds
- `/search`: 120 requests per 60 seconds
- `/save-weblink`: 10 requests per 60 seconds
- `/save-to-daily-note`: 5 requests per 60 seconds

## License

MIT - see [LICENSE](LICENSE) file for details.