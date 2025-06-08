export const meetingNotesPrompt = {
	name: "capacities-meeting-notes",
	description: "Structure meeting notes for Capacities daily note",
	arguments: [
		{
			name: "meeting_title",
			description: "Title or topic of the meeting",
			required: true,
		},
		{
			name: "attendees",
			description: "Who attended the meeting",
			required: false,
		},
		{
			name: "key_decisions",
			description: "Important decisions made",
			required: false,
		},
		{
			name: "action_items",
			description: "Action items and next steps",
			required: false,
		},
		{
			name: "notes",
			description: "Additional notes or discussion points",
			required: false,
		},
	],
	// biome-ignore lint/suspicious/noExplicitAny: FastMCP prompt args type
	load: async (args: any) => {
		let meeting = `## Meeting: ${args.meeting_title}\n`;
		meeting += `**Date:** ${new Date().toLocaleDateString()}\n`;

		if (args.attendees) {
			meeting += `**Attendees:** ${args.attendees}\n`;
		}
		meeting += "\n";

		if (args.key_decisions) {
			meeting += `### Decisions\n${args.key_decisions}\n\n`;
		}

		if (args.action_items) {
			meeting += `### Action Items\n${args.action_items}\n\n`;
		}

		if (args.notes) {
			meeting += `### Notes\n${args.notes}\n\n`;
		}

		return `Here are your structured meeting notes:\n\n${meeting}Ready to add to your Capacities daily note?`;
	},
};
