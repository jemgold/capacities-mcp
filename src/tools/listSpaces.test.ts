import { describe, expect, it, vi, beforeEach } from "vitest";
import { listSpacesTool } from "./listSpaces.js";

// Mock the API module
vi.mock("../api.js", () => ({
	makeApiRequest: vi.fn(),
}));

import { makeApiRequest } from "../api.js";

describe("listSpacesTool", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should have correct metadata", () => {
		expect(listSpacesTool.name).toBe("capacities_list_spaces");
		expect(listSpacesTool.description).toBe("Get a list of all personal spaces in Capacities");
		expect(listSpacesTool.annotations.readOnlyHint).toBe(true);
	});

	it("should successfully list spaces", async () => {
		const mockSpaces = [
			{ id: "123", title: "My Space" },
			{ id: "456", title: "Work Space" },
		];

		const mockResponse = {
			json: async () => mockSpaces,
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const result = await listSpacesTool.execute();
		
		expect(makeApiRequest).toHaveBeenCalledWith("/spaces");
		expect(JSON.parse(result)).toEqual(mockSpaces);
	});

	it("should handle API errors", async () => {
		const error = new Error("API Error");
		(makeApiRequest as any).mockRejectedValueOnce(error);

		await expect(listSpacesTool.execute()).rejects.toThrow(
			"Failed to list spaces: API Error"
		);
	});
});