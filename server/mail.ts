import nodemailer from "nodemailer";

// Create reusable transporter object using the default SMTP transport
// Create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER || "rsfederationng@gmail.com",
    // Google App Passwords often have spaces when copied, but must be sent without them
    pass: (process.env.EMAIL_PASSWORD || "").replace(/\s+/g, ""),
  },
  family: 4, // Forces IPv4 to prevent ENETUNREACH errors
  logger: true, // Log to console
  debug: true, // Include debug info
  connectionTimeout: 30000, // 30s
  greetingTimeout: 30000, // 30s
  socketTimeout: 30000, // 30s
});

interface ContactEmailProps {
  name: string;
  email: string;
  type: string;
  message: string;
  subject?: string;
  phone?: string;
}

export async function sendContactEmails(data: ContactEmailProps) {
  const { name, email, type, message, subject, phone } = data;
  const adminEmail = process.env.EMAIL_USER || "rsfederationng@gmail.com";

  // 1. Admin Notification
  const adminMailOptions = {
    from: `"NRSA Website" <${adminEmail}>`,
    to: adminEmail,
    subject: `New Contact Submission: ${type} - ${name}`,
    html: `
      <h2>New Contact Submission</h2>
      <p><strong>Type:</strong> ${type}</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || "N/A"}</p>
      <p><strong>Subject:</strong> ${subject || "N/A"}</p>
      <br>
      <h3>Message:</h3>
      <p style="background-color: #f4f4f4; padding: 15px; border-left: 4px solid #4CAF50;">${message}</p>
    `,
  };

  // 2. User Auto-Acknowledgement (Dictionary-based templates)
  let userSubject = "Thank you for contacting NRSA";
  let userBody = "";

  if (type === "Partnership") {
    userSubject = "Partnership Inquiry - NRSA";
    userBody = `
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to the Nigeria Rope Skipping Association regarding a potential partnership.</p>
      <p>We have received your message and our business development team will review your proposal. We appreciate your interest in supporting the growth of rope skipping in Nigeria.</p>
      <p>We will be in touch shortly to discuss this further.</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>NRSA Partnership Team</strong></p>
    `;
  } else if (type === "Registration") {
    userSubject = "Welcome to NRSA - Registration Inquiry";
    userBody = `
      <p>Hi ${name}!</p>
      <p>Thanks for your interest in joining the NRSA family! We're excited to hear from you.</p>
      <p>We have received your registration inquiry. A representative will review your details and guide you through the next steps to become an official member/athlete.</p>
      <p>In the meantime, feel free to check out our <a href="https://nrsa.com.ng/events">upcoming events</a>.</p>
      <br>
      <p>Keep skipping,</p>
      <p><strong>NRSA Member Support</strong></p>
    `;
  } else {
    // General / Volunteering
    userSubject = "We received your message - NRSA";
    userBody = `
      <p>Dear ${name},</p>
      <p>Thank you for contacting the Nigeria Rope Skipping Association.</p>
      <p>We have received your message regarding "<strong>${subject || "General Inquiry"}</strong>" and will get back to you as soon as possible.</p>
      <br>
      <p>Best Regards,</p>
      <p><strong>NRSA Admin Team</strong></p>
    `;
  }

  const userMailOptions = {
    from: `"NRSA Support" <${adminEmail}>`,
    to: email,
    subject: userSubject,
    html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        ${userBody}
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
        <small style="color: #666;">Nigeria Rope Skipping Association</small>
      </div>
    `,
  };

  try {
    console.log(`📧 Sending admin notification for ${type}...`);
    await transporter.sendMail(adminMailOptions);
    console.log(`✅ Admin notification sent.`);

    console.log(`📧 Sending auto-ack to user (${email})...`);
    await transporter.sendMail(userMailOptions);
    console.log(`✅ User auto-ack sent.`);

    return true;
  } catch (error) {
    console.error("❌ Error sending emails:", error);
    return false;
  }
}

export async function verifyEmailConnection() {
  const user = process.env.EMAIL_USER || "rsfederationng@gmail.com";
  const rawPass = process.env.EMAIL_PASSWORD || "";
  const cleanPass = rawPass.replace(/\s+/g, "");

  console.log(`🔌 Verifying SMTP connection for user: ${user}`);
  console.log(`🔑 Password status: ${rawPass ? `Present (${rawPass.length} chars)` : "Missing"}`);
  if (rawPass !== cleanPass) {
    console.log(`⚠️  Notice: Password contained spaces, they have been stripped automatically.`);
  }

  try {
    const verified = await transporter.verify();
    console.log("✅ SMTP Connection Verified Successfully!");
    return {
      success: true,
      message: "SMTP Connection Verified",
      user,
      hasPassword: !!cleanPass,
      passwordLength: cleanPass.length
    };
  } catch (error: any) {
    console.error("❌ SMTP Verification Error:", error);
    return {
      success: false,
      message: error.message,
      user,
      hasPassword: !!cleanPass,
      hint: error.code === 'EAUTH' ? "Check your App Password. Make sure 2FA is on and you generated an 'App Password' for Mail." : "Network or configuration error"
    };
  }
}
