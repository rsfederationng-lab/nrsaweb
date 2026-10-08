import { Resend } from 'resend';
import {
  AdminNotificationEmail,
  NewsletterWelcomeEmail,
  PartnershipAckEmail,
  RegistrationAckEmail,
  GeneralAckEmail,
  SchoolRegistrationConfirmationEmail,
  AdminSchoolRegistrationNotificationEmail,
  SchoolSelectedEmail,
  SchoolNotSelectedEmail,
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

// ─── SCHOOL REGISTRATION EMAILS ──────────────────────────────────────────────

export async function sendSchoolRegistrationConfirmation(data: {
  schoolName: string;
  coordinatorName: string;
  coordinatorEmail: string;
  phase: string;
  state: string;
}) {
  const html = SchoolRegistrationConfirmationEmail({
    schoolName: data.schoolName,
    coordinatorName: data.coordinatorName,
    phase: data.phase,
    state: data.state,
  });

  return await sendBrandedEmail({
    to: data.coordinatorEmail,
    subject: `Registration Confirmed - ${data.phase} Championship`,
    html,
  });
}

export async function sendAdminSchoolRegistrationNotification(data: {
  schoolName: string;
  coordinatorName: string;
  email: string;
  phone: string;
  whatsappNumber: string;
  phase: string;
  state: string;
  athleteCount: number;
  category: string;
  registrationId: number;
}) {
  const adminEmail = process.env.EMAIL_USER || "rsfederationng@gmail.com";
  
  const html = AdminSchoolRegistrationNotificationEmail(data);

  return await sendBrandedEmail({
    to: adminEmail,
    subject: `New School Registration - ${data.schoolName}`,
    html,
    fromName: "NRSA Website",
  });
}

export async function sendSchoolSelectionEmail(data: {
  schoolName: string;
  coordinatorName: string;
  coordinatorEmail: string;
  phase: string;
  state: string;
  venue: string;
  competitionDate: string;
  whatsappGroupLink?: string;
  isSelected: boolean;
}) {
  let html: string;
  let subject: string;

  if (data.isSelected) {
    html = SchoolSelectedEmail({
      schoolName: data.schoolName,
      coordinatorName: data.coordinatorName,
      phase: data.phase,
      state: data.state,
      venue: data.venue,
      competitionDate: data.competitionDate,
      whatsappGroupLink: data.whatsappGroupLink,
    });
    subject = `Congratulations! Selected for ${data.phase} Championship`;
  } else {
    html = SchoolNotSelectedEmail({
      schoolName: data.schoolName,
      coordinatorName: data.coordinatorName,
      phase: data.phase,
      state: data.state,
    });
    subject = `${data.phase} Championship Update`;
  }

  return await sendBrandedEmail({
    to: data.coordinatorEmail,
    subject,
    html,
  });
}

export async function sendSchoolRegistrationStatusEmail(data: {
  schoolName: string;
  coordinatorName: string;
  coordinatorEmail: string;
  phase: string;
  state: string;
  venue: string;
  competitionDate: string;
  athleteCount: number;
  category: string;
  status: string;
  adminNotes?: string | null;
  whatsappGroupLink?: string;
}) {
  const escapeHtml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  const statusDetails: Record<string, { title: string; message: string }> = {
    pending: {
      title: "Registration received",
      message: "Your school registration has been received and is awaiting review by the NRSA competition team.",
    },
    under_review: {
      title: "Registration under review",
      message: "The NRSA competition team is currently reviewing your school registration and submitted details.",
    },
    selected: {
      title: "Congratulations — your school has been selected",
      message: "Your school has been selected to participate in this championship phase. Please review the event details below and prepare your team.",
    },
    not_selected: {
      title: "Registration outcome",
      message: "Thank you for registering. Your school was not selected for this championship phase. We appreciate your interest in NRSA competitions.",
    },
    waitlisted: {
      title: "Your school has been waitlisted",
      message: "Your school is currently on the waiting list. NRSA will contact you if a place becomes available.",
    },
    withdrawn: {
      title: "Registration withdrawn",
      message: "Your school registration has been marked as withdrawn. Please contact NRSA if this was not intended.",
    },
  };
  const details = statusDetails[data.status] || {
    title: "Registration status updated",
    message: "Your school registration status has been updated by the NRSA competition team.",
  };
  const note = data.adminNotes
    ? `<div style="background:#fff8e1;border-left:4px solid #f2c94c;padding:14px;margin:20px 0"><strong>Message from NRSA:</strong><br>${escapeHtml(data.adminNotes)}</div>`
    : "";
  const whatsapp = data.whatsappGroupLink
    ? `<p><strong>Phase WhatsApp group:</strong> <a href="${escapeHtml(data.whatsappGroupLink)}" style="color:#009739">Join the official group</a></p>`
    : "";

  return sendBrandedEmail({
    to: data.coordinatorEmail,
    subject: `${details.title} — ${data.phase} | NRSA`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#17202a;max-width:680px;margin:auto">
        <div style="background:#009739;color:#fff;padding:24px;border-radius:10px 10px 0 0">
          <h1 style="margin:0;font-size:24px">Nigeria Rope Skipping Association</h1>
          <p style="margin:8px 0 0;color:#e7fff0">National Interschool Championship</p>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:0">
          <p>Hello ${escapeHtml(data.coordinatorName)},</p>
          <h2 style="color:#009739;margin-bottom:8px">${details.title}</h2>
          <p>${details.message}</p>
          <div style="background:#f0fdf4;border-left:4px solid #009739;padding:14px;margin:20px 0">
            <strong>School:</strong> ${escapeHtml(data.schoolName)}<br>
            <strong>Registration status:</strong> ${escapeHtml(data.status.replace(/_/g, " "))}<br>
            <strong>Championship phase:</strong> ${escapeHtml(data.phase)}<br>
            <strong>State:</strong> ${escapeHtml(data.state)}
          </div>
          <h3>Competition details</h3>
          <p><strong>Venue:</strong> ${escapeHtml(data.venue)}</p>
          <p><strong>Competition date:</strong> ${escapeHtml(data.competitionDate)}</p>
          <p><strong>Registered athletes:</strong> ${data.athleteCount}</p>
          <p><strong>Category:</strong> ${escapeHtml(data.category)}</p>
          ${whatsapp}
          ${note}
          <p>Please keep this email for your records. Contact the NRSA team if any information is incorrect or if you need clarification.</p>
          <p style="color:#6b7280;font-size:12px">This is an automated notification from NRSA. Please do not share sensitive information by email.</p>
        </div>
      </div>
    `,
    fromName: "NRSA Competitions",
  });
}

export async function sendStoreOrderEmails(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentStatus: string;
  items: Array<{ productName: string; quantity: number; unitPrice: number }>;
}) {
  const rows = data.items.map((item) =>
    `<li>${item.quantity} × ${item.productName} — ₦${(item.unitPrice * item.quantity).toLocaleString()}</li>`
  ).join("");
  const html = `
    <h2>NRSA Store order ${data.orderNumber}</h2>
    <p>Hello ${data.customerName},</p>
    <p>Your order is currently <strong>${data.paymentStatus}</strong>.</p>
    <ul>${rows}</ul>
    <p><strong>Total: ₦${data.amount.toLocaleString()}</strong></p>
    <p>Keep your order number for future support: ${data.orderNumber}</p>
  `;
  const adminEmail = process.env.STORE_ADMIN_EMAIL || process.env.EMAIL_USER || "rsfederationng@gmail.com";
  const customerEmailSent = await sendBrandedEmail({
    to: data.customerEmail,
    subject: `NRSA Store order ${data.orderNumber}`,
    html,
  });
  const adminEmailSent = await sendBrandedEmail({
    to: adminEmail,
    subject: `NRSA Store order received: ${data.orderNumber}`,
    html,
    fromName: "NRSA Store",
  });
  return customerEmailSent && adminEmailSent;
}

export async function sendStoreFulfillmentUpdate(data: {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  fulfillmentStatus: string;
  paymentStatus: string;
  fulfillmentMethod: string;
  deliveryAddress?: string | null;
  amount: number;
  currency: string;
  items: Array<{ productName: string; quantity: number; unitPrice: number }>;
}) {
  const escapeHtml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
  const labels: Record<string, { title: string; message: string }> = {
    pending: { title: "Order received", message: "Your order is in our queue and will be processed shortly." },
    processing: { title: "Order processing", message: "Our team is preparing your items." },
    ready_for_pickup: { title: "Ready for pickup", message: "Your order is ready. Please contact NRSA Store support before coming to collect it." },
    shipped: { title: "Order shipped", message: "Your order has been dispatched for delivery." },
    completed: { title: "Order completed", message: "Your order has been completed. Thank you for supporting NRSA." },
    cancelled: { title: "Order cancelled", message: "Your order has been cancelled. Please contact NRSA Store support if you need clarification." },
  };
  const status = labels[data.fulfillmentStatus] || {
    title: "Order status updated",
    message: "Your order status has been updated by the NRSA Store team.",
  };
  const rows = data.items.map((item) =>
    `<tr><td style="padding:10px 0;border-bottom:1px solid #e5e7eb">${escapeHtml(item.productName)}</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:center">${item.quantity}</td><td style="padding:10px 0;border-bottom:1px solid #e5e7eb;text-align:right">₦${(item.unitPrice * item.quantity).toLocaleString()}</td></tr>`
  ).join("");
  const destination = data.fulfillmentMethod === "delivery"
    ? `Delivery address: ${escapeHtml(data.deliveryAddress || "Address to be confirmed")}`
    : "Fulfillment method: Pickup";
  return sendBrandedEmail({
    to: data.customerEmail,
    subject: `${status.title} — NRSA Store ${data.orderNumber}`,
    html: `
      <div style="font-family:Arial,sans-serif;color:#17202a;max-width:640px;margin:auto">
        <div style="background:#009739;color:#fff;padding:24px;border-radius:10px 10px 0 0">
          <h1 style="margin:0;font-size:24px">NRSA Store</h1>
          <p style="margin:8px 0 0;color:#e7fff0">Order status notification</p>
        </div>
        <div style="padding:24px;border:1px solid #e5e7eb;border-top:0">
          <p>Hello ${escapeHtml(data.customerName)},</p>
          <h2 style="color:#009739;margin-bottom:8px">${status.title}</h2>
          <p>${status.message}</p>
          <div style="background:#f0fdf4;border-left:4px solid #009739;padding:14px;margin:20px 0">
            <strong>Order number:</strong> ${escapeHtml(data.orderNumber)}<br>
            <strong>Payment status:</strong> ${escapeHtml(data.paymentStatus)}<br>
            <strong>Fulfillment:</strong> ${escapeHtml(data.fulfillmentStatus.replace(/_/g, " "))}<br>
            <strong>${destination}</strong>
          </div>
          <h3>Order summary</h3>
          <table style="width:100%;border-collapse:collapse">
            <thead><tr><th style="text-align:left;padding:10px 0">Item</th><th style="text-align:center;padding:10px 0">Qty</th><th style="text-align:right;padding:10px 0">Amount</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="text-align:right;font-size:18px"><strong>Total: ${escapeHtml(data.currency)} ${data.amount.toLocaleString()}</strong></p>
          <p style="margin-top:24px">Keep your order number for support. If you have questions, reply to this email or contact the NRSA Store team.</p>
          <p style="color:#6b7280;font-size:12px">This is an automated message. Please do not share your payment details by email.</p>
        </div>
      </div>
    `,
    fromName: "NRSA Store",
  });
}
