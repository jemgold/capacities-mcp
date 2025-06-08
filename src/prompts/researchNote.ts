export const researchNotePrompt = {
	name: "capacities-research-note",
	description: "Format research findings for saving to Capacities",
	arguments: [
		{
			name: "topic",
			description: "The research topic or subject",
			required: true,
		},
		{
			name: "source_url",
			description: "URL of the source material",
			required: false,
		},
		{
			name: "key_points",
			description: "Main findings or key points",
			required: true,
		},
		{
			name: "questions",
			description: "Follow-up questions or areas to explore",
			required: false,
		},
	],
	// biome-ignore lint/suspicious/noExplicitAny: FastMCP prompt args type
	load: async (args: any) => {
		let note = `# Research: ${args.topic}\n\n`;

		if (args.source_url) {
			note += `**Source:** ${args.source_url}\n\n`;
		}

		note += `## Key Findings\n${args.key_points}\n\n`;

		if (args.questions) {
			note += `## Questions to Explore\n${args.questions}\n\n`;
		}

		note += `---\n*Research note created on ${new Date().toLocaleDateString()}*`;

		return `Here's a formatted research note ready for Capacities:\n\n${note}\n\nWould you like me to save this to your Capacities space?`;
	},
};
