import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { dailySummaryPrompt } from "./dailySummary.js";

describe("dailySummaryPrompt", () => {
	beforeEach(() => {
		// Mock date for consistent testing
		vi.useFakeTimers();
		vi.setSystemTime(new Date("2024-01-15T14:30:00"));
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("should have correct metadata", () => {
		expect(dailySummaryPrompt.name).toBe("capacities-daily-summary");
		expect(dailySummaryPrompt.description).toContain("daily summary");
		expect(dailySummaryPrompt.arguments).toHaveLength(3);
		expect(dailySummaryPrompt.arguments[0].required).toBe(true);
		expect(dailySummaryPrompt.arguments[1].required).toBe(false);
	});

	it("should generate summary with only required fields", async () => {
		const args = {
			key_activities: "- Completed project proposal\n- Team meeting",
		};

		const result = await dailySummaryPrompt.load(args);
		
		expect(result).toContain("## Daily Summary - 1/15/2024");
		expect(result).toContain("### Key Activities");
		expect(result).toContain("- Completed project proposal");
		expect(result).toContain("*Generated at 2:30:00 PM*");
		expect(result).not.toContain("### Insights");
		expect(result).not.toContain("### Tomorrow's Focus");
	});

	it("should generate complete summary with all fields", async () => {
		const args = {
			key_activities: "- Launched new feature",
			insights: "User feedback was overwhelmingly positive",
			tomorrow_focus: "- Fix reported bugs\n- Plan next sprint",
		};

		const result = await dailySummaryPrompt.load(args);
		
		expect(result).toContain("### Key Activities");
		expect(result).toContain("- Launched new feature");
		expect(result).toContain("### Insights & Learnings");
		expect(result).toContain("User feedback was overwhelmingly positive");
		expect(result).toContain("### Tomorrow's Focus");
		expect(result).toContain("- Fix reported bugs");
	});

	it("should include instructions for use", async () => {
		const args = {
			key_activities: "Test",
		};

		const result = await dailySummaryPrompt.load(args);
		expect(result).toContain("Use this formatted summary for a Capacities daily note:");
	});
});