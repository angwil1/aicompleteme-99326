import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface InviteEmailRequest {
  recipientEmail: string;
  personalMessage?: string;
  senderName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { recipientEmail, personalMessage, senderName }: InviteEmailRequest = await req.json();

    console.log(`Sending invite email to: ${recipientEmail}`);

    const defaultMessage = "I found this quiet space for meaningful connections. Thought you might appreciate it too.";
    const message = personalMessage || defaultMessage;
    const fromName = senderName || "A friend";

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const emailHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h1 style="color: #2d3748; font-size: 24px; margin-bottom: 20px;">You've been invited</h1>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
          ${message}
        </p>
        <p style="color: #4a5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
          Join a community built on authentic connections, meaningful conversations, and genuine relationships.
        </p>
        <a href="${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '') || 'https://yourapp.com'}" 
           style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600;">
          Begin Your Journey
        </a>
        <p style="color: #718096; font-size: 14px; margin-top: 40px;">
          This is a quiet space where connections matter more than swipes.
        </p>
      </div>
    `;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Quiet Connections <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `${fromName} invited you to a special community`,
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend API error:", errorText);
      throw new Error(`Failed to send email: ${response.status} ${errorText}`);
    }

    const emailResponse = await response.json();
    console.log("Invite email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error sending invite email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
