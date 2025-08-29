from fastmcp import FastMCP
import httpx

from app.config import settings
from app.schemas.template import TemplateOut

# Create MCP server
mcp = FastMCP("Prompt Master MCP Server")


@mcp.tool(
    name="get_all_templates", description="獲取所有模板（包含用戶模板和預設模板）"
)
async def get_all_templates() -> list[TemplateOut]:
    """
    獲取所有模板（包含用戶模板和預設模板）
    當有 token 時：回傳用戶模板 + 預設模板
    當無 token 時：只回傳預設模板
    Returns:
        list[TemplateOut]: 獲取所有模板
    """
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"http://localhost:{settings.port}/api/v1/templates/"
        )
        return response.json()


mcp_app = mcp.http_app(path="/", transport="streamable-http")
