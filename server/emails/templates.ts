import { BaseTemplate } from "./base.js";
import { Greeting, ContentBlock, HighlightBlock, CTAButton, Divider } from "./components.js";
import { emailConfig } from "./config.js";

// 1. Admin Notification Template
export function AdminNotificationEmail(data: { type: string; name: string; email: string; phone?: string; subject?: string; message: string; }) {
  const content = `
    ${Greeting('Admin')}
    ${ContentBlock(`You have received a new <strong>${data.type}</strong> submission from the website.`)}
    
    ${HighlightBlock(`
      <strong>Name:</strong> ${data.name}<br>
      <strong>Email:</strong> ${data.email}<br>
      <strong>Phone:</strong> ${data.phone || "N/A"}<br>
      <strong>Subject:</strong> ${data.subject || "N/A"}
    `)}
    
    ${ContentBlock(`<strong>Message:</strong><br>${data.message.replace(/\\n/g, '<br>')}`)}
  `;

  return BaseTemplate({
    title: `New ${data.type} Submission`,
    previewText: `New contact submission from ${data.name}`,
    contentHtml: content,
  });
}

// 2. Newsletter Welcome
export function NewsletterWelcomeEmail(email: string) {
  const content = `
    ${Greeting('Skipper')}
    ${ContentBlock(`Welcome to the ${emailConfig.brand.name} community! We are thrilled to have you with us.`)}
    ${ContentBlock(`You will now receive the latest updates, event announcements, and exclusive insights from the world of rope skipping in Nigeria directly in your inbox.`)}
    
    ${CTAButton('Explore Upcoming Events', `${emailConfig.brand.websiteUrl}/events`)}
    
    ${ContentBlock(`If you have any questions, feel free to reply to this email. Let's keep skipping!`)}
    ${Divider()}
    ${ContentBlock(`<span style="font-size: 14px; color: ${emailConfig.brand.colors.text.muted};">You are receiving this email because you subscribed on our website with the address: ${email}</span>`)}
  `;

  return BaseTemplate({
    title: 'Welcome to NRSA Newsletter',
    previewText: 'Thanks for subscribing to our newsletter!',
    contentHtml: content,
  });
}

// 3. Partnership Inquiry
export function PartnershipAckEmail(name: string) {
  const content = `
    ${Greeting(name)}
    ${ContentBlock(`Thank you for reaching out to the ${emailConfig.brand.name} regarding a potential partnership.`)}
    ${ContentBlock(`We have received your message and our business development team will thoroughly review your proposal. We deeply appreciate your interest in supporting the growth of rope skipping in Nigeria.`)}
    ${ContentBlock(`We will be in touch shortly to discuss this further.`)}
    
    ${CTAButton('Learn About Partners', `${emailConfig.brand.websiteUrl}/partnership`)}
  `;

  return BaseTemplate({
    title: 'Partnership Inquiry - NRSA',
    previewText: 'Thank you for your partnership inquiry.',
    contentHtml: content,
  });
}

// 4. Registration Inquiry
export function RegistrationAckEmail(name: string) {
  const content = `
    ${Greeting(name)}
    ${ContentBlock(`Thanks for your interest in joining the NRSA family! We're excited to hear from you.`)}
    ${ContentBlock(`We have safely received your registration inquiry. A representative will review your details and guide you through the next steps to become an official member or athlete.`)}
    
    ${HighlightBlock(`While you wait, did you know we host workshops and championships year round?`)}
    
    ${CTAButton('View Competition Details', `${emailConfig.brand.websiteUrl}/interschool-championship`)}
  `;

  return BaseTemplate({
    title: 'Registration Inquiry - NRSA',
    previewText: 'Welcome to NRSA!',
    contentHtml: content,
  });
}

// 5. General Acknowledgement
export function GeneralAckEmail(name: string, subject?: string) {
  const content = `
    ${Greeting(name)}
    ${ContentBlock(`Thank you for contacting the ${emailConfig.brand.name}.`)}
    ${ContentBlock(`We have successfully received your message regarding "<strong>${subject || "General Inquiry"}</strong>" and our support team will get back to you as soon as possible.`)}
  `;

  return BaseTemplate({
    title: `We received your message - NRSA`,
    previewText: 'Thank you for contacting us.',
    contentHtml: content,
  });
}

// ─── SCHOOL REGISTRATION EMAILS ──────────────────────────────────────────────

// 1. School Registration Confirmation (sent immediately upon registration)
export function SchoolRegistrationConfirmationEmail(data: {
  schoolName: string;
  coordinatorName: string;
  phase: string;
  state: string;
}) {
  const content = `
    ${Greeting(data.coordinatorName)}
    ${ContentBlock(`
      Thank you for registering <strong>${data.schoolName}</strong> for the ${emailConfig.brand.name} 
      <strong>${data.phase}</strong> Interschool Championship.
    `)}
    
    ${HighlightBlock(`
      <strong>Registration Details:</strong><br>
      <strong>School:</strong> ${data.schoolName}<br>
      <strong>State:</strong> ${data.state}<br>
      <strong>Phase:</strong> ${data.phase}
    `)}
    
    ${ContentBlock(`
      Your registration has been successfully received. Our team will review all submissions and 
      communicate the next steps through the email and WhatsApp number you provided.
    `)}
    
    ${ContentBlock(`
      <strong>What Happens Next?</strong><br>
      • Our team will review your submission<br>
      • Selected schools will be notified via email and WhatsApp<br>
      • You will receive a WhatsApp group invite link to join your state's championship group
    `)}
    
    ${ContentBlock(`
      If you have any questions, please don't hesitate to contact us.
    `)}
    
    ${Divider()}
    
    ${ContentBlock(`
      <span style="font-size: 14px; color: ${emailConfig.brand.colors.text.muted};">
        This is an automated confirmation. You will receive another email once selections are finalized.
      </span>
    `)}
  `;

  return BaseTemplate({
    title: `Registration Confirmation - ${data.schoolName}`,
    previewText: `Your school has been successfully registered for the NRSA ${data.phase} Championship.`,
    contentHtml: content,
  });
}

// 2. Admin Notification for New School Registration
export function AdminSchoolRegistrationNotificationEmail(data: {
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
  const content = `
    ${Greeting('Admin')}
    ${ContentBlock(`
      A new school has registered for the <strong>${data.phase}</strong> championship.
    `)}
    
    ${HighlightBlock(`
      <strong>School Details:</strong><br>
      <strong>School Name:</strong> ${data.schoolName}<br>
      <strong>State:</strong> ${data.state}<br>
      <strong>Coordinator:</strong> ${data.coordinatorName}<br>
      <strong>Email:</strong> ${data.email}<br>
      <strong>Phone:</strong> ${data.phone}<br>
      <strong>WhatsApp:</strong> ${data.whatsappNumber}<br>
      <strong>Athletes:</strong> ${data.athleteCount}<br>
      <strong>Category:</strong> ${data.category}<br>
      <strong>Registration ID:</strong> #${data.registrationId}
    `)}
    
    ${CTAButton('Review in Admin Dashboard', `${emailConfig.brand.websiteUrl}/admin-nrsa-dashboard/interschool`)}
  `;

  return BaseTemplate({
    title: `New School Registration - ${data.schoolName}`,
    previewText: `${data.schoolName} has registered for ${data.phase} championship.`,
    contentHtml: content,
  });
}

// 3. School Selection Notification (SELECTED)
export function SchoolSelectedEmail(data: {
  schoolName: string;
  coordinatorName: string;
  phase: string;
  state: string;
  venue: string;
  competitionDate: string;
  whatsappGroupLink?: string;
}) {
  const content = `
    ${Greeting(data.coordinatorName)}
    ${ContentBlock(`
      <strong style="color: ${emailConfig.brand.colors.primary}; font-size: 18px;">
        Congratulations! 🎉
      </strong>
    `)}
    
    ${ContentBlock(`
      We are pleased to inform you that <strong>${data.schoolName}</strong> has been 
      <strong>SELECTED</strong> to participate in the ${emailConfig.brand.name} 
      <strong>${data.phase}</strong> Interschool Championship.
    `)}
    
    ${HighlightBlock(`
      <strong>Championship Details:</strong><br>
      <strong>Phase:</strong> ${data.phase}<br>
      <strong>State:</strong> ${data.state}<br>
      <strong>Venue:</strong> ${data.venue}<br>
      <strong>Competition Date:</strong> ${data.competitionDate}
    `)}
    
    ${ContentBlock(`
      <strong>Next Steps:</strong><br>
      1. Join the official WhatsApp group for your state (link below)<br>
      2. Prepare your athletes for the competition<br>
      3. Watch for further instructions in the WhatsApp group<br>
      4. Ensure all participants have valid consent forms
    `)}
    
    ${data.whatsappGroupLink ? CTAButton(`Join ${data.state} WhatsApp Group`, data.whatsappGroupLink) : ''}
    
    ${ContentBlock(`
      We look forward to seeing your athletes showcase their rope skipping talents 
      at the national stage. Best of luck!
    `)}
    
    ${Divider()}
    
    ${ContentBlock(`
      <span style="font-size: 14px; color: ${emailConfig.brand.colors.text.muted};">
        For any questions, please contact us at ${emailConfig.contact.email}
      </span>
    `)}
  `;

  return BaseTemplate({
    title: `Selected - ${data.phase} Championship`,
    previewText: `Congratulations! ${data.schoolName} has been selected for the NRSA ${data.phase} Championship.`,
    contentHtml: content,
  });
}

// 4. School Not Selected Notification
export function SchoolNotSelectedEmail(data: {
  schoolName: string;
  coordinatorName: string;
  phase: string;
  state: string;
}) {
  const content = `
    ${Greeting(data.coordinatorName)}
    ${ContentBlock(`
      Thank you for registering <strong>${data.schoolName}</strong> for the ${emailConfig.brand.name} 
      <strong>${data.phase}</strong> Interschool Championship.
    `)}
    
    ${ContentBlock(`
      After careful review of all submissions, we regret to inform you that your school 
      was not selected for this phase of the championship. We received an overwhelming 
      number of registrations and could only accommodate a limited number of schools.
    `)}
    
    ${ContentBlock(`
      <strong>We encourage you to:</strong><br>
      • Continue developing your rope skipping program<br>
      • Watch for future championship announcements<br>
      • Register for the next season's competition<br>
      • Stay connected with NRSA for training opportunities
    `)}
    
    ${CTAButton('View Other NRSA Programs', `${emailConfig.brand.websiteUrl}/events`)}
    
    ${ContentBlock(`
      Your enthusiasm and commitment to rope skipping in Nigeria is greatly appreciated. 
      We hope to see ${data.schoolName} participate in future NRSA events.
    `)}
    
    ${Divider()}
    
    ${ContentBlock(`
      <span style="font-size: 14px; color: ${emailConfig.brand.colors.text.muted};">
        For inquiries, contact us at ${emailConfig.contact.email}
      </span>
    `)}
  `;

  return BaseTemplate({
    title: `${data.phase} Championship Update`,
    previewText: `Thank you for your interest in the NRSA ${data.phase} Championship.`,
    contentHtml: content,
  });
}
