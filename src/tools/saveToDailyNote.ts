import { z } from "zod";
import { makeApiRequest } from "../api.js";

export const saveToDailyNoteTool = {
	annotations: {
		openWorldHint: true,
		readOnlyHint: false,
		title: "Save to Daily Note",
	},
	description: "Add markdown text to today's daily note in a Capacities space",
	execute: async (args: {
		spaceId: string;
		mdText: string;
		origin?: "commandPalette";
		NoTimeStamp?: boolean; // <-- changed here
	}) => {
		try {
			const requestBody = {
				spaceId: args.spaceId,
				mdText: args.mdText,
				...(args.origin && { origin: args.origin }),
				...(args.NoTimeStamp !== undefined && {
					NoTimeStamp: args.NoTimeStamp, // <-- changed here
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
		NoTimeStamp: z // <-- changed here
			.boolean()
			.optional()
			.describe("If true, no time stamp will be added to the note"),
	}),
};
