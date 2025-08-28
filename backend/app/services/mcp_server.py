from fastmcp import FastMCP

# Create MCP server
mcp = FastMCP("Prompt Master MCP Server")

mcp_app = mcp.http_app(path="/", transport="streamable-http")
