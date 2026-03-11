const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { to, toName, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, subject, body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const smtpUser = Deno.env.get("SMTP_USER")!;
    const smtpPass = Deno.env.get("SMTP_PASS")!;

    // Use Microsoft Graph API via Outlook SMTP relay
    // Since SMTP STARTTLS is problematic in edge runtime, use raw TLS on port 465
    const conn = await Deno.connectTls({
      hostname: "smtp-mail.outlook.com",
      port: 587,
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    async function readResponse(): Promise<string> {
      const buf = new Uint8Array(4096);
      const n = await conn.read(buf);
      return decoder.decode(buf.subarray(0, n!));
    }

    async function sendCmd(cmd: string): Promise<string> {
      await conn.write(encoder.encode(cmd + "\r\n"));
      return await readResponse();
    }

    // Read greeting
    await readResponse();

    await sendCmd(`EHLO lovable.app`);
    await sendCmd(`AUTH LOGIN`);
    await sendCmd(btoa(smtpUser));
    await sendCmd(btoa(smtpPass));
    await sendCmd(`MAIL FROM:<${smtpUser}>`);
    await sendCmd(`RCPT TO:<${to}>`);
    await sendCmd(`DATA`);

    const recipient = toName ? `${toName} <${to}>` : to;
    const mimeMessage = [
      `From: ${smtpUser}`,
      `To: ${recipient}`,
      `Subject: =?UTF-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      `MIME-Version: 1.0`,
      `Content-Type: text/html; charset=UTF-8`,
      ``,
      body,
      `.`,
    ].join("\r\n");

    const dataResp = await sendCmd(mimeMessage);
    await sendCmd(`QUIT`);
    conn.close();

    if (!dataResp.startsWith("2")) {
      throw new Error(`SMTP error: ${dataResp}`);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send email error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
