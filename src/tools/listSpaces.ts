import { z } from "zod";
import { makeApiRequest } from "../api.js";

export const listSpacesTool = {
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
};
