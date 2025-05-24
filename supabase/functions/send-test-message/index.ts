
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TestMessageRequest {
  channel: 'sms' | 'whatsapp' | 'email';
  phoneNumber?: string;
  email?: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { channel, phoneNumber, email, message }: TestMessageRequest = await req.json();

    console.log(`Testing ${channel} message to ${phoneNumber || email}`);

    let result;

    switch (channel) {
      case 'sms':
        result = await sendSMS(phoneNumber!, message);
        break;
      case 'whatsapp':
        result = await sendWhatsApp(phoneNumber!, message);
        break;
      case 'email':
        result = await sendEmail(email!, message);
        break;
      default:
        throw new Error('Invalid channel');
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error("Error in send-test-message function:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

async function sendSMS(phoneNumber: string, message: string) {
  const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioFromNumber = Deno.env.get("TWILIO_PHONE_NUMBER");

  if (!twilioSid || !twilioToken || !twilioFromNumber) {
    return {
      success: false,
      error: "Twilio credentials not configured. Please set up SMS integration in Settings."
    };
  }

  try {
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: twilioFromNumber,
          To: phoneNumber,
          Body: message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send SMS"
      };
    }

    return {
      success: true,
      message: `SMS sent successfully to ${phoneNumber}. Message SID: ${data.sid}`,
      messageId: data.sid
    };

  } catch (error: any) {
    return {
      success: false,
      error: `SMS sending failed: ${error.message}`
    };
  }
}

async function sendWhatsApp(phoneNumber: string, message: string) {
  const twilioSid = Deno.env.get("TWILIO_ACCOUNT_SID");
  const twilioToken = Deno.env.get("TWILIO_AUTH_TOKEN");
  const twilioWhatsAppNumber = Deno.env.get("TWILIO_WHATSAPP_NUMBER") || "whatsapp:+14155238886"; // Twilio sandbox number

  if (!twilioSid || !twilioToken) {
    return {
      success: false,
      error: "Twilio credentials not configured. Please set up WhatsApp integration in Settings."
    };
  }

  try {
    const whatsappTo = phoneNumber.startsWith("whatsapp:") ? phoneNumber : `whatsapp:${phoneNumber}`;
    
    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${twilioSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          "Authorization": `Basic ${btoa(`${twilioSid}:${twilioToken}`)}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          From: twilioWhatsAppNumber,
          To: whatsappTo,
          Body: message,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || "Failed to send WhatsApp message"
      };
    }

    return {
      success: true,
      message: `WhatsApp message sent successfully to ${phoneNumber}. Message SID: ${data.sid}`,
      messageId: data.sid
    };

  } catch (error: any) {
    return {
      success: false,
      error: `WhatsApp sending failed: ${error.message}`
    };
  }
}

async function sendEmail(email: string, message: string) {
  const smtpHost = Deno.env.get("SMTP_HOST");
  const smtpPort = Deno.env.get("SMTP_PORT");
  const smtpUser = Deno.env.get("SMTP_USER");
  const smtpPassword = Deno.env.get("SMTP_PASSWORD");
  const fromEmail = Deno.env.get("FROM_EMAIL");

  if (!smtpHost || !smtpUser || !smtpPassword || !fromEmail) {
    return {
      success: false,
      error: "Email SMTP credentials not configured. Please set up email integration in Settings."
    };
  }

  // For now, return a mock success since implementing full SMTP in edge functions is complex
  // In production, you'd use a service like SendGrid, Mailgun, or AWS SES
  return {
    success: true,
    message: `Email would be sent to ${email}. (SMTP integration needs to be implemented)`,
    note: "Email functionality requires full SMTP implementation or email service integration."
  };
}

serve(handler);
