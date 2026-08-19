import { NextRequest, NextResponse } from "next/server";
import { peekRemaining, type ToolName } from "@/lib/rate-limit";
import { resolveTier } from "@/lib/tier";

const VALID_TOOLS: ToolName[] = [
  "meta-checker",
  "keyword-analyser",
  "page-speed",
  "robots-checker",
];

export async function GET(req: NextRequest) {
  const tool = req.nextUrl.searchParams.get("tool");
  if (!tool || !VALID_TOOLS.includes(tool as ToolName)) {
    return NextResponse.json({ error: "invalid_tool" }, { status: 400 });
  }

  const { tier, userId } = await resolveTier();
  const { limit, remaining } = await peekRemaining(
    req,
    tool as ToolName,
    tier,
    userId
  );

  return NextResponse.json({ tier, limit, remaining });
}
