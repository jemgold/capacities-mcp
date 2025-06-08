import { describe, expect, test } from "bun:test";
import { saveToDailyNoteTool } from "./saveToDailyNote.js";

describe("saveToDailyNoteTool", () => {
	test("should have correct metadata", () => {
		expect(saveToDailyNoteTool.name).toBe("capacities_save_to_daily_note");
		expect(saveToDailyNoteTool.annotations.readOnlyHint).toBe(false);
		expect(saveToDailyNoteTool.annotations.openWorldHint).toBe(true);
		expect(saveToDailyNoteTool.annotations.title).toBe("Save to Daily Note");
		expect(saveToDailyNoteTool.description).toBe("Add markdown text to today's daily note in a Capacities space");
	});

	test("should have correct parameter schema", () => {
		expect(saveToDailyNoteTool.parameters).toBeDefined();
		expect(saveToDailyNoteTool.parameters.shape.spaceId).toBeDefined();
		expect(saveToDailyNoteTool.parameters.shape.mdText).toBeDefined();
		expect(saveToDailyNoteTool.parameters.shape.origin.isOptional()).toBe(true);
		expect(saveToDailyNoteTool.parameters.shape.noTimestamp.isOptional()).toBe(true);
		expect(typeof saveToDailyNoteTool.execute).toBe("function");
	});

	test("should validate origin parameter enum", () => {
		const originSchema = saveToDailyNoteTool.parameters.shape.origin;
		expect(originSchema._def.innerType._def.values).toEqual(["commandPalette"]);
	});
});