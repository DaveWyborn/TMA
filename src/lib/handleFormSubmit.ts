"use server";

import { createClient } from "@supabase/supabase-js";

export const handleFormSubmit = async ({
  type,
  name,
  email,
  website_url,
  message,
  honeypot,
}: {
  type: string;
  name: string;
  email: string;
  website_url?: string;
  message?: string;
  honeypot?: string;
}) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  

  let spam_status = "OK";

  // ✅ 1) Honeypot check
  if (honeypot && honeypot.trim() !== "") {
    spam_status = "Suspected Spam";
  }

  // ✅ 2) Repeat check (same email, last 24h)
  const { data: recentSubmissions, error: fetchError } = await supabase
    .from("tma_buy_now_leads")
    .select("id, spam_status, created_at")
    .eq("email", email)
    .gte(
      "created_at",
      new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    );

  if (fetchError) {
    console.error("Supabase fetch error:", fetchError);
    return { success: false, error: fetchError.message };
  }

  if (recentSubmissions.length >= 3) {
    spam_status = "Suspected Spam";
  }

  if (recentSubmissions?.some((r) => r.spam_status === "Spam")) {
    console.log("Known spammer — quietly dropping.");
    return { success: true };
  }

  // ✅ 4) Insert
  const { error: insertError } = await supabase.from("tma_buy_now_leads").insert({
    type,
    name,
    email,
    website_url: website_url || null,
    message: message || null,
    spam_status,
  });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return { success: false, error: insertError.message };
  }

  console.log(`Saved: ${email} (${spam_status})`);
  return { success: true };
};
