export const dailySummaryPrompt = {
	name: "capacities-daily-summary",
	description:
		"Create a structured daily summary for your Capacities daily note",
	arguments: [
		{
			name: "key_activities",
			description: "Main activities or events from today",
			required: true,
		},
		{
			name: "insights",
			description: "Key insights, learnings, or realizations",
			required: false,
		},
		{
			name: "tomorrow_focus",
			description: "What you want to focus on tomorrow",
			required: false,
		},
	],
	// biome-ignore lint/suspicious/noExplicitAny: FastMCP prompt args type
	load: async (args: any) => {
		let summary = `## Daily Summary - ${new Date().toLocaleDateString()}\n\n`;
		summary += `### Key Activities\n${args.key_activities}\n\n`;

		if (args.insights) {
			summary += `### Insights & Learnings\n${args.insights}\n\n`;
		}

		if (args.tomorrow_focus) {
			summary += `### Tomorrow's Focus\n${args.tomorrow_focus}\n\n`;
		}

		summary += `---\n*Generated at ${new Date().toLocaleTimeString()}*`;

		return `Use this formatted summary for a Capacities daily note:\n\n${summary}`;
	},
};
