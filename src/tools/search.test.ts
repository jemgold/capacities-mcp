import { describe, expect, it, vi, beforeEach } from "vitest";
import { searchTool } from "./search.js";

// Mock the API module
vi.mock("../api.js", () => ({
	makeApiRequest: vi.fn(),
}));

import { makeApiRequest } from "../api.js";

describe("searchTool", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should have correct metadata", () => {
		expect(searchTool.name).toBe("capacities_search");
		expect(searchTool.description).toContain("Search for content");
		expect(searchTool.parameters.shape.mode.isOptional()).toBe(true);
	});

	it("should search with required parameters only", async () => {
		const mockResults = { results: ["item1", "item2"] };
		const mockResponse = {
			json: async () => mockResults,
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			searchTerm: "test query",
			spaceIds: ["space-123"],
		};

		const result = await searchTool.execute(args);
		
		expect(makeApiRequest).toHaveBeenCalledWith("/search", {
			method: "POST",
			body: JSON.stringify({
				searchTerm: "test query",
				spaceIds: ["space-123"],
			}),
		});
		expect(JSON.parse(result)).toEqual(mockResults);
	});

	it("should search with optional parameters", async () => {
		const mockResults = { results: [] };
		const mockResponse = {
			json: async () => mockResults,
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			searchTerm: "test",
			spaceIds: ["space-123"],
			mode: "fullText" as const,
			filterStructureIds: ["struct-456"],
		};

		await searchTool.execute(args);
		
		expect(makeApiRequest).toHaveBeenCalledWith("/search", {
			method: "POST",
			body: JSON.stringify({
				searchTerm: "test",
				spaceIds: ["space-123"],
				mode: "fullText",
				filterStructureIds: ["struct-456"],
			}),
		});
	});

	it("should handle search errors", async () => {
		const error = new Error("Search failed");
		(makeApiRequest as any).mockRejectedValueOnce(error);

		const args = {
			searchTerm: "test",
			spaceIds: ["space-123"],
		};

		await expect(searchTool.execute(args)).rejects.toThrow(
			"Failed to search content: Search failed"
		);
	});
});