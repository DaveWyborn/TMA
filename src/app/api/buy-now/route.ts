import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  const body = await request.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  let spam_status = "OK";

  // ✅ Honeypot check
  if (body.honeypot && body.honeypot.trim() !== "") {
    spam_status = "Suspected Spam";
  }

  // ✅ Repeat submission check
  const { data: recentSubmissions, error: fetchError } = await supabase
    .from("tma_buy_now_leads")
    .select("id, spam_status, created_at")
    .eq("email", body.email)
    .gte(
      "created_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

  if (fetchError) {
    console.error("Supabase fetch error:", fetchError);
    return NextResponse.json({ success: false, error: fetchError.message });
  }

  if (recentSubmissions.length >= 3) {
    spam_status = "Suspected Spam";
  }

  if (recentSubmissions.some((r) => r.spam_status === "Spam")) {
    console.log("Known spammer — quietly dropping.");
    return NextResponse.json({ success: true });
  }

  // ✅ Insert new record
  const { error: insertError } = await supabase.from("tma_buy_now_leads").insert({
    type: body.type,
    name: body.name,
    email: body.email,
    website_url: body.website_url || null,
    message: body.message || null,
    spam_status,
  });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return NextResponse.json({ success: false, error: insertError.message });
  }

  console.log(`Saved: ${body.email} (${spam_status})`);
  return NextResponse.json({ success: true });
}
