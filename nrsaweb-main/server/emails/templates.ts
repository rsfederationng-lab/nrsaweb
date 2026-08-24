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
