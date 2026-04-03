import { Resend } from 'resend';
import {
  AdminNotificationEmail,
  NewsletterWelcomeEmail,
  PartnershipAckEmail,
  RegistrationAckEmail,
  GeneralAckEmail
} from './emails/templates.js';

// Initialize Resend
// Note: Ensure RESEND_API_KEY is available in your .env
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

export async function sendBrandedEmail(data: {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  fromName?: string;
}) {
  const fromEmail = data.from || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
  const fromName = data.fromName || "NRSA Support";
  
  try {
    const response = await resend.emails.send({
      from: `"${fromName}" <${fromEmail}>`,
      to: data.to,
      subject: data.subject,
      html: data.html,
    });
    
    if (response.error) {
      console.error("❌ Resend Email Error:", response.error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("❌ Error sending branded email:", error);
    return false;
  }
}

// Higher-order convenience methods for the standard website triggers

export async function sendNewsletterWelcome(email: string) {
  console.log(`📧 Sending Newsletter Welcome to ${email}...`);
  const html = NewsletterWelcomeEmail(email);
  return await sendBrandedEmail({
    to: email,
    subject: "Welcome to the NRSA Newsletter!",
    html
  });
}

export interface ContactEmailProps {
  name: string;
  email: string;
  type: string;
  message: string;
  subject?: string;
  phone?: string;
}

export async function sendContactEmails(data: ContactEmailProps) {
  const adminEmail = process.env.EMAIL_USER || "rsfederationng@gmail.com";
  
  // 1. Send Admin Notification
  console.log(`📧 Sending Admin Notification for ${data.type}...`);
  const adminHtml = AdminNotificationEmail(data);
  const adminSubject = `New Contact Submission: ${data.type} - ${data.name}`;
  
  await sendBrandedEmail({
    to: adminEmail,
    subject: adminSubject,
    html: adminHtml,
    fromName: "NRSA Website"
  });

  // 2. Send User Acknowledgement
  console.log(`📧 Sending Auto-Ack to user (${data.email})...`);
  let userHtml = "";
  let userSubject = "";

  if (data.type === "Partnership") {
    userHtml = PartnershipAckEmail(data.name);
    userSubject = "Partnership Inquiry - NRSA";
  } else if (data.type === "Registration") {
    userHtml = RegistrationAckEmail(data.name);
    userSubject = "Welcome to NRSA - Registration Inquiry";
  } else {
    userHtml = GeneralAckEmail(data.name, data.subject);
    userSubject = "We received your message - NRSA";
  }

  await sendBrandedEmail({
    to: data.email,
    subject: userSubject,
    html: userHtml,
  });

  return true;
}

export async function verifyEmailConnection() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn("❌ Verification failed: RESEND_API_KEY is missing.");
    return {
      success: false,
      message: "RESEND_API_KEY is missing from environment variables.",
      user: "Resend",
      hasPassword: false,
      hint: "Add RESEND_API_KEY in your .env configuration."
    };
  }
  
  console.log("✅ Resend SDK configured with API Key.");
  return {
    success: true,
    message: "Resend configured successfully",
    user: "Resend SDK",
    hasPassword: true,
    passwordLength: apiKey.length
  };
}
