import { describe, expect, it, vi, beforeEach } from "vitest";
import { saveToDailyNoteTool } from "./saveToDailyNote.js";

// Mock the API module
vi.mock("../api.js", () => ({
	makeApiRequest: vi.fn(),
}));

import { makeApiRequest } from "../api.js";

describe("saveToDailyNoteTool", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should have correct metadata", () => {
		expect(saveToDailyNoteTool.name).toBe("capacities_save_to_daily_note");
		expect(saveToDailyNoteTool.annotations.readOnlyHint).toBe(false);
		expect(saveToDailyNoteTool.parameters.shape.origin.isOptional()).toBe(true);
		expect(saveToDailyNoteTool.parameters.shape.noTimestamp.isOptional()).toBe(true);
	});

	it("should save to daily note with response data", async () => {
		const mockResponse = {
			text: async () => JSON.stringify({ id: "note-123", success: true }),
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			spaceId: "space-123",
			mdText: "## Today's thoughts\n\nGreat day!",
		};

		const result = await saveToDailyNoteTool.execute(args);
		
		expect(makeApiRequest).toHaveBeenCalledWith("/save-to-daily-note", {
			method: "POST",
			body: JSON.stringify({
				spaceId: "space-123",
				mdText: "## Today's thoughts\n\nGreat day!",
			}),
		});
		expect(result).toContain('"id": "note-123"');
	});

	it("should handle empty response", async () => {
		const mockResponse = {
			text: async () => "",
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			spaceId: "space-123",
			mdText: "Quick note",
		};

		const result = await saveToDailyNoteTool.execute(args);
		expect(result).toBe("Success: Content saved to daily note (no response data)");
	});

	it("should handle non-JSON response", async () => {
		const mockResponse = {
			text: async () => "OK",
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			spaceId: "space-123",
			mdText: "Note content",
			noTimestamp: true,
		};

		const result = await saveToDailyNoteTool.execute(args);
		expect(result).toBe("Success: Content saved to daily note. Response: OK");
	});

	it("should include optional parameters when provided", async () => {
		const mockResponse = {
			text: async () => "",
		};
		(makeApiRequest as any).mockResolvedValueOnce(mockResponse);

		const args = {
			spaceId: "space-123",
			mdText: "Note",
			origin: "commandPalette" as const,
			noTimestamp: false,
		};

		await saveToDailyNoteTool.execute(args);
		
		expect(makeApiRequest).toHaveBeenCalledWith("/save-to-daily-note", {
			method: "POST",
			body: JSON.stringify({
				spaceId: "space-123",
				mdText: "Note",
				origin: "commandPalette",
				noTimestamp: false,
			}),
		});
	});

	it("should handle API errors", async () => {
		const error = new Error("Save failed");
		(makeApiRequest as any).mockRejectedValueOnce(error);

		const args = {
			spaceId: "space-123",
			mdText: "Test",
		};

		await expect(saveToDailyNoteTool.execute(args)).rejects.toThrow(
			"Failed to save to daily note: Save failed"
		);
	});
});