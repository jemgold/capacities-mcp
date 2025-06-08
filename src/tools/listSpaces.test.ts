import { describe, expect, test } from "bun:test";
import { listSpacesTool } from "./listSpaces.js";

describe("listSpacesTool", () => {
	test("should have correct metadata", () => {
		expect(listSpacesTool.name).toBe("capacities_list_spaces");
		expect(listSpacesTool.description).toBe("Get a list of all personal spaces in Capacities");
		expect(listSpacesTool.annotations.readOnlyHint).toBe(true);
		expect(listSpacesTool.annotations.openWorldHint).toBe(true);
		expect(listSpacesTool.annotations.title).toBe("List Capacities Spaces");
	});

	test("should have correct parameter schema", () => {
		expect(listSpacesTool.parameters).toBeDefined();
		expect(typeof listSpacesTool.execute).toBe("function");
	});
});