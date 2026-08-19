import { auth, clerkClient } from "@clerk/nextjs/server";
import type { Tier } from "./rate-limit";

const clerkConfigured =
  !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  !!process.env.CLERK_SECRET_KEY;

export async function resolveTier(): Promise<{
  tier: Tier;
  userId: string | null;
}> {
  if (!clerkConfigured) {
    return { tier: "anon", userId: null };
  }

  const { userId } = await auth();
  if (!userId) return { tier: "anon", userId: null };

  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const metadataTier = (user.publicMetadata as { tier?: string })?.tier;
    if (metadataTier === "paid") return { tier: "paid", userId };
    return { tier: "free", userId };
  } catch {
    return { tier: "free", userId };
  }
}
