import { describe, expect, test } from "bun:test";
import { searchTool } from "./search.js";

describe("searchTool", () => {
	test("should have correct metadata", () => {
		expect(searchTool.name).toBe("capacities_search");
		expect(searchTool.description).toContain("Search for content");
		expect(searchTool.annotations.readOnlyHint).toBe(true);
		expect(searchTool.annotations.openWorldHint).toBe(true);
		expect(searchTool.annotations.title).toBe("Search Capacities Content");
	});

	test("should have correct parameter schema", () => {
		expect(searchTool.parameters).toBeDefined();
		expect(searchTool.parameters.shape.searchTerm).toBeDefined();
		expect(searchTool.parameters.shape.spaceIds).toBeDefined();
		expect(searchTool.parameters.shape.mode.isOptional()).toBe(true);
		expect(searchTool.parameters.shape.filterStructureIds.isOptional()).toBe(true);
		expect(typeof searchTool.execute).toBe("function");
	});
});