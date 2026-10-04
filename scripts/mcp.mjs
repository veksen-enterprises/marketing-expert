#!/usr/bin/env node
// Command-line MCP client for this server: lets a person or an agent use the tools without an MCP host.
//   node scripts/mcp.mjs instructions
//   node scripts/mcp.mjs tools
//   node scripts/mcp.mjs prompts
//   node scripts/mcp.mjs call <tool> '<json args>'
//   node scripts/mcp.mjs prompt <name> '<json args>'
// Requires `npm run build`. Environment variables (e.g. MARKETING_EXPERT_DATA_DIR) pass through.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const [cmd, name, json] = process.argv.slice(2);
const client = new Client({ name: "mcp-cli", version: "0.1.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: [join(root, "dist/index.js")], env: process.env, stderr: "ignore" }));
try {
  if (cmd === "instructions") console.log(client.getInstructions());
  else if (cmd === "tools") for (const t of (await client.listTools()).tools) console.log(`## ${t.name}\n${t.description}\nargs: ${JSON.stringify(t.inputSchema.properties)}\n`);
  else if (cmd === "prompts") for (const p of (await client.listPrompts()).prompts) console.log(`## ${p.name}: ${p.description}\nargs: ${(p.arguments ?? []).map((a) => a.name).join(", ")}\n`);
  else if (cmd === "call") {
    const r = await client.callTool({ name, arguments: json ? JSON.parse(json) : {} });
    if (r.isError) process.exitCode = 1;
    for (const c of r.content) console.log(c.text);
  } else if (cmd === "prompt") {
    const r = await client.getPrompt({ name, arguments: json ? JSON.parse(json) : {} });
    for (const m of r.messages) console.log(m.content.text);
  } else {
    console.error("usage: mcp.mjs instructions | tools | prompts | call <tool> '<json>' | prompt <name> '<json>'");
    process.exitCode = 2;
  }
} finally {
  await client.close();
}
