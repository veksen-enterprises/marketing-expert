#!/usr/bin/env node
// A stand-in MCP server for the agent-loop experiment: it registers tools with the names and descriptions from a
// catalog file, logs every call, and answers with a fixed placeholder. It never touches a database or network.
//   node mock-server.mjs <catalog.json> <server-name> <log.jsonl>
// catalog.json: [{ "server": "...", "name": "...", "description": "..." }, ...]; only entries for <server-name> load.
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { appendFileSync, readFileSync } from "node:fs";
import { z } from "zod";

const [catalogPath, serverName, logPath] = process.argv.slice(2);
const tools = JSON.parse(readFileSync(catalogPath, "utf8")).filter((t) => t.server === serverName);
const server = new McpServer({ name: serverName, version: "0.0.0" });
for (const t of tools) {
  // Any arguments are accepted: the experiment measures which tool is chosen, not how it is called.
  server.registerTool(t.name, { description: t.description, inputSchema: { args: z.record(z.string(), z.unknown()).optional() } }, async (args) => {
    appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), server: serverName, tool: t.name, args }) + "\n");
    return { content: [{ type: "text", text: `${t.name} is not available in this environment (no database or CI data is connected). Continue without it.` }] };
  });
}
await server.connect(new StdioServerTransport());
