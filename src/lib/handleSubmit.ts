"use server";

import { createClient } from "@supabase/supabase-js";

export const handleFormSubmit = async ({
  type,  // 'call' or 'contact'
  name,
  email,
  website_url,
  message,
  honeypot
}: {
  type: string;
  name: string;
  email: string;
  website_url?: string;
  message?: string;
  honeypot?: string;
}) => {
  // ✅ 0) Create Supabase client (Edge function style)
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
    .from("TMA_buy_now_leads")
    .select("id, spam_status, created_at")
    .eq("email", email)
    .gte("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

  if (fetchError) {
    console.error("Supabase fetch error:", fetchError);
    return { success: false, error: fetchError.message };
  }

  if (recentSubmissions.length >= 3) {
    spam_status = "Suspected Spam";
  }

  // ✅ 3) Already confirmed spam? Quietly drop.
  if (recentSubmissions?.some((r) => r.spam_status === "Spam")) {
    console.log("Known spammer — quietly dropping submission.");
    return { success: true }; // Fake success
  }

  // ✅ 4) Insert
  const { error: insertError } = await supabase.from("TMA_buy_now_leads").insert({
    type,
    name,
    email,
    website_url: website_url || null,
    message: message || null,
    spam_status
  });

  if (insertError) {
    console.error("Supabase insert error:", insertError);
    return { success: false, error: insertError.message };
  }

  console.log(`Saved: ${email} (${spam_status})`);
  return { success: true };
};
