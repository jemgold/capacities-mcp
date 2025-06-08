#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import "dotenv/config";

import {
	getSpaceInfoTool,
	listSpacesTool,
	saveToDailyNoteTool,
	saveWeblinkTool,
	searchTool,
} from "./tools/index.js";

import {
	dailySummaryPrompt,
	meetingNotesPrompt,
	researchNotePrompt,
} from "./prompts/index.js";

const server = new FastMCP({
	name: "Capacities",
	version: "1.0.0",
});

// Register all tools
server.addTool(listSpacesTool);
server.addTool(getSpaceInfoTool);
server.addTool(searchTool);
server.addTool(saveWeblinkTool);
server.addTool(saveToDailyNoteTool);

// Register all prompts
server.addPrompt(dailySummaryPrompt);
server.addPrompt(researchNotePrompt);
server.addPrompt(meetingNotesPrompt);

server.start({
	transportType: "stdio",
});
