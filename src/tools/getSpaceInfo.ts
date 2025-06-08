import { z } from "zod";
import { makeApiRequest } from "../api.js";

export const getSpaceInfoTool = {
	annotations: {
		openWorldHint: true,
		readOnlyHint: true,
		title: "Get Capacities Space Info",
	},
	description:
		"Get detailed information about a specific Capacities space including structures and collections",
	execute: async (args: { spaceId: string }) => {
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
};
