export async function handleFormSubmit({
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
}) {
  if (honeypot && honeypot.trim() !== "") {
    console.log("Bot detected via honeypot — ignoring.");
    return { success: true };
  }

  try {
    const res = await fetch("/api/buy-now", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        name,
        email,
        website_url,
        message,
        honeypot,
      }),
    });

    if (!res.ok) {
      console.error("Form submit failed:", res.status, res.statusText);
      return { success: false };
    }

    const result = await res.json();
    console.log("API result:", result);
    return result;
  } catch (err) {
    console.error("handleFormSubmit error:", err);
    return { success: false };
  }
}
