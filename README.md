# Capacities MCP Server

An MCP (Model Context Protocol) server for [Capacities](https://capacities.io), providing seamless integration with your knowledge management system.

## Features

This MCP server provides access to all current Capacities API endpoints:

- **List Spaces** - Get all your personal spaces
- **Space Information** - Retrieve detailed space structures and collections
- **Search Content** - Search across spaces with advanced filtering
- **Save Weblinks** - Save URLs to your spaces with metadata
- **Daily Notes** - Add content to your daily notes

## Installation

### For Claude Desktop

Add the Capacities MCP server to your Claude Desktop configuration (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS):

```json
{
  "mcpServers": {
    "capacities": {
      "command": "npx",
      "args": ["-y", "capacities-mcp"],
      "env": {
        "CAPACITIES_API_KEY": "your_capacities_api_key_here"
      }
    }
  }
}
```

Get your Capacities API key from your [Capacities account settings](https://capacities.io/).

That's it! The server will be automatically downloaded and run when Claude Desktop starts.

## Development

### Local Setup

For local development, you'll need to clone and build the project:

1. Clone this repository:
```bash
git clone https://github.com/jemgold/capacities-mcp.git
cd capacities-mcp
```

2. Install dependencies:
```bash
bun install
```

3. Copy the example environment file:
```bash
cp .env.example .env
```

4. Add your Capacities API key to `.env`:
```
CAPACITIES_API_KEY=your_api_key_here
```

5. Build the server:
```bash
bun run build
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
- **titleOverwrite** (optional): Custom title for the link
- **descriptionOverwrite** (optional): Description text
- **tags** (optional): Array of tags. Tags need to exactly match your tag names in Capacities, otherwise they will be created.
- **mdText** (optional): Text formatted as markdown that will be added to the notes section

### `capacities_save_to_daily_note`
Add markdown content to today's daily note in a space.
- **spaceId**: UUID of the target space
- **mdText**: Markdown content to add
- **origin** (optional): Origin label for the content (only "commandPalette" is supported)
- **noTimestamp** (optional): If true, no timestamp will be added to the note

## Rate Limits

The Capacities API has the following rate limits:
- `/spaces`: 5 requests per 60 seconds
- `/space-info`: 5 requests per 60 seconds
- `/search`: 120 requests per 60 seconds
- `/save-weblink`: 10 requests per 60 seconds
- `/save-to-daily-note`: 5 requests per 60 seconds

## Example Prompts

Here are some example prompts you can use with Claude when this MCP server is configured:

### Getting Started
```
"Show me all my Capacities spaces"
"What spaces do I have in Capacities?"
```

### Exploring Your Knowledge Base
```
"Get detailed information about my main workspace in Capacities"
"What structures and collections are in my [space name] space?"
```

### Searching Content
```
"Search for 'project management' across all my Capacities spaces"
"Find all notes mentioning 'machine learning' in my research space"
"Search for 'meeting notes' but only check titles, not full content"
```

### Saving Information
```
"Save this article to my research space: https://example.com/article"
"Bookmark this GitHub repo in my coding space with tags 'javascript' and 'tools'"
"Save this link with a custom title and description to my resources space"
```

### Daily Notes
```
"Add a summary of today's key insights to my daily note"
"Save these meeting notes to today's daily note in my work space"
"Add this quote to my daily note: [your quote here]"
```

### Advanced Usage
```
"Search for 'productivity' in my work and personal spaces, but filter to only show task-related structures"
"Save this research paper to my academic space and add it to today's daily note as well"
"Find all my notes about 'AI tools' and then save the best ones as bookmarks"
```

## License

MIT - see [LICENSE](LICENSE) file for details.