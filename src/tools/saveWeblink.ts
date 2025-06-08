import { z } from "zod";
import { makeApiRequest } from "../api.js";

export const saveWeblinkTool = {
	annotations: {
		openWorldHint: true,
		readOnlyHint: false,
		title: "Save Weblink to Capacities",
	},
	description:
		"Save a web link to a Capacities space with optional title and tags",
	execute: async (args: {
		spaceId: string;
		url: string;
		titleOverwrite?: string;
		descriptionOverwrite?: string;
		tags?: string[];
		mdText?: string;
	}) => {
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
};
