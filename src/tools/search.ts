import { z } from "zod";
import { makeApiRequest } from "../api.js";

export const searchTool = {
	annotations: {
		openWorldHint: true,
		readOnlyHint: true,
		title: "Search Capacities Content",
	},
	description:
		"Search for content across Capacities spaces with optional filtering",
	execute: async (args: {
		searchTerm: string;
		spaceIds: string[];
		mode?: "fullText" | "title";
		filterStructureIds?: string[];
	}) => {
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
};
