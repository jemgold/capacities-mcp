import { FastMCP } from "fastmcp";
import { z } from "zod";
import "dotenv/config";

const API_BASE_URL = "https://api.capacities.io";

function getApiKey(): string {
	const apiKey = process.env.CAPACITIES_API_KEY;
	if (!apiKey) {
		throw new Error("CAPACITIES_API_KEY environment variable is required");
	}
	return apiKey;
}

async function makeApiRequest(
	endpoint: string,
	options: RequestInit = {},
): Promise<Response> {
	const apiKey = getApiKey();

	const requestOptions = {
		...options,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			...options.headers,
		},
	};

	const response = await fetch(`${API_BASE_URL}${endpoint}`, requestOptions);

	if (!response.ok) {
		const errorText = await response.text();
		throw new Error(
			`Capacities API error: ${response.status} ${response.statusText} - ${errorText}`,
		);
	}

	return response;
}

const server = new FastMCP({
	name: "Capacities",
	version: "1.0.0",
});

server.addTool({
	annotations: {
		openWorldHint: true,
		readOnlyHint: true,
		title: "List Capacities Spaces",
	},
	description: "Get a list of all personal spaces in Capacities",
	execute: async () => {
		try {
			const response = await makeApiRequest("/spaces");
			const data = await response.json();
			return JSON.stringify(data, null, 2);
		} catch (error) {
			throw new Error(
				`Failed to list spaces: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
	name: "capacities_list_spaces",
	parameters: z.object({}),
});

server.addTool({
	annotations: {
		openWorldHint: true,
		readOnlyHint: true,
		title: "Get Capacities Space Info",
	},
	description:
		"Get detailed information about a specific Capacities space including structures and collections",
	execute: async (args) => {
		try {
			const response = await makeApiRequest(
				`/space-info?spaceid=${args.spaceId}`,
			);
			const data = await response.json();
			return JSON.stringify(data, null, 2);
		} catch (error) {
			throw new Error(
				`Failed to get space info: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
	name: "capacities_get_space_info",
	parameters: z.object({
		spaceId: z
			.string()
			.uuid()
			.describe("The UUID of the space to get information for"),
	}),
});

server.addTool({
	annotations: {
		openWorldHint: true,
		readOnlyHint: true,
		title: "Search Capacities Content",
	},
	description:
		"Search for content across Capacities spaces with optional filtering",
	execute: async (args) => {
		try {
			const requestBody = {
				searchTerm: args.searchTerm,
				spaceIds: args.spaceIds,
				...(args.mode && { mode: args.mode }),
				...(args.filterStructureIds && {
					filterStructureIds: args.filterStructureIds,
				}),
			};

			const response = await makeApiRequest("/search", {
				method: "POST",
				body: JSON.stringify(requestBody),
			});

			const data = await response.json();
			return JSON.stringify(data, null, 2);
		} catch (error) {
			throw new Error(
				`Failed to search content: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
	name: "capacities_search",
	parameters: z.object({
		searchTerm: z.string().describe("The search term to look for"),
		spaceIds: z
			.array(z.string().uuid())
			.describe("Array of space UUIDs to search in"),
		mode: z
			.enum(["fullText", "title"])
			.optional()
			.describe("Search mode: fullText or title only")
			.default("title"),
		filterStructureIds: z
			.array(z.string().uuid())
			.optional()
			.describe("Optional array of structure IDs to filter results"),
	}),
});

server.addTool({
	annotations: {
		openWorldHint: true,
		readOnlyHint: false,
		title: "Save Weblink to Capacities",
	},
	description:
		"Save a web link to a Capacities space with optional title and tags",
	execute: async (args) => {
		try {
			const requestBody = {
				spaceId: args.spaceId,
				url: args.url,
				...(args.titleOverwrite && { titleOverwrite: args.titleOverwrite }),
				...(args.descriptionOverwrite && {
					descriptionOverwrite: args.descriptionOverwrite,
				}),
				...(args.tags && { tags: args.tags }),
				...(args.mdText && { mdText: args.mdText }),
			};

			const response = await makeApiRequest("/save-weblink", {
				method: "POST",
				body: JSON.stringify(requestBody),
			});

			const responseText = await response.text();
			if (!responseText.trim()) {
				return "Success: Weblink saved (no response data)";
			}

			try {
				const data = JSON.parse(responseText);
				return JSON.stringify(data, null, 2);
			} catch (parseError) {
				return `Success: Weblink saved. Response: ${responseText}`;
			}
		} catch (error) {
			throw new Error(
				`Failed to save weblink: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
	name: "capacities_save_weblink",
	parameters: z.object({
		spaceId: z
			.string()
			.uuid()
			.describe("The UUID of the space to save the weblink to"),
		url: z.string().url().describe("The URL to save"),
		titleOverwrite: z
			.string()
			.max(500)
			.optional()
			.describe("Optional custom title for the weblink"),
		descriptionOverwrite: z
			.string()
			.max(500)
			.optional()
			.describe("Optional description for the weblink"),
		tags: z
			.array(z.string())
			.max(30)
			.optional()
			.describe(
				"Optional Tags to add to the weblink. Tags need to exactly match your tag names in Capacities, otherwise they will be created.",
			),
		mdText: z
			.string()
			.max(200000)
			.optional()
			.describe(
				"Text formatted as markdown that will be added to the notes section",
			),
	}),
});

server.addTool({
	annotations: {
		openWorldHint: true,
		readOnlyHint: false,
		title: "Save to Daily Note",
	},
	description: "Add markdown text to today's daily note in a Capacities space",
	execute: async (args) => {
		try {
			const requestBody = {
				spaceId: args.spaceId,
				mdText: args.mdText,
				...(args.origin && { origin: args.origin }),
				...(args.addTimestamp !== undefined && {
					addTimestamp: args.addTimestamp,
				}),
			};

			const response = await makeApiRequest("/save-to-daily-note", {
				method: "POST",
				body: JSON.stringify(requestBody),
			});

			// Check if response has content before parsing JSON
			const responseText = await response.text();
			if (!responseText.trim()) {
				return "Success: Content saved to daily note (no response data)";
			}

			try {
				const data = JSON.parse(responseText);
				return JSON.stringify(data, null, 2);
			} catch (parseError) {
				return `Success: Content saved to daily note. Response: ${responseText}`;
			}
		} catch (error) {
			throw new Error(
				`Failed to save to daily note: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	},
	name: "capacities_save_to_daily_note",
	parameters: z.object({
		spaceId: z
			.string()
			.uuid()
			.describe("The UUID of the space to save to the daily note"),
		mdText: z
			.string()
			.max(200000)
			.describe("The markdown text to add to today's daily note"),
		origin: z
			.enum(["commandPalette"])
			.optional()
			.describe(
				"Optional origin label for the content (only 'commandPalette' is supported)",
			),
		noTimestamp: z
			.boolean()
			.optional()
			.describe("If true, no time stamp will be added to the note"),
	}),
});

server.start({
	transportType: "stdio",
});
