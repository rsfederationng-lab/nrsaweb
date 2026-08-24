import { emailConfig } from "./config.js";

const { brand } = emailConfig;

export function Header(): string {
  return `
    <div style="background-color: ${brand.colors.surface}; padding: 24px; text-align: center; border-bottom: 3px solid ${brand.colors.primary};">
      <img src="${brand.logoUrl}" alt="${brand.shortName} Logo" style="max-height: 60px; width: auto; margin: 0 auto; display: block;" />
    </div>
  `;
}

export function Footer(): string {
  const year = new Date().getFullYear();
  return `
    <div style="background-color: ${brand.colors.background}; padding: 32px 24px; text-align: center; border-top: 1px solid ${brand.colors.border};">
      <div style="margin-bottom: 16px;">
        <a href="${emailConfig.social.instagram}" style="color: ${brand.colors.primary}; text-decoration: none; margin: 0 8px; font-weight: bold;">Instagram</a> |
        <a href="${emailConfig.social.twitter}" style="color: ${brand.colors.primary}; text-decoration: none; margin: 0 8px; font-weight: bold;">X (Twitter)</a> |
        <a href="${emailConfig.social.facebook}" style="color: ${brand.colors.primary}; text-decoration: none; margin: 0 8px; font-weight: bold;">Facebook</a>
      </div>
      <p style="color: ${brand.colors.text.muted}; font-size: 13px; margin: 0 0 8px 0; line-height: 1.5;">
        <strong>${brand.name}</strong>
      </p>
      <p style="color: ${brand.colors.text.muted}; font-size: 12px; margin: 0;">
        &copy; ${year} ${brand.name}. All rights reserved.<br>
        <a href="${brand.websiteUrl}" style="color: ${brand.colors.text.muted}; text-decoration: underline;">Visit our website</a>
      </p>
    </div>
  `;
}

export function Greeting(name: string): string {
  return `<h2 style="color: ${brand.colors.text.main}; font-size: 20px; font-weight: 600; margin-top: 0; margin-bottom: 16px;">Hi ${name},</h2>`;
}

export function ContentBlock(contentHtml: string): string {
  return `<div style="color: ${brand.colors.text.main}; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">${contentHtml}</div>`;
}

export function HighlightBlock(contentHtml: string): string {
  return `
    <div style="background-color: #f0fdf4; border-left: 4px solid ${brand.colors.primary}; padding: 16px; margin-bottom: 24px; color: ${brand.colors.text.main}; font-size: 15px; line-height: 1.5; border-radius: 0 4px 4px 0;">
      ${contentHtml}
    </div>
  `;
}

export function CTAButton(text: string, url: string): string {
  return `
    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
      <tr>
        <td align="center">
          <a href="${url}" style="background-color: ${brand.colors.primary}; color: ${brand.colors.text.light}; display: inline-block; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px; text-align: center; mso-padding-alt: 0; text-underline-color: ${brand.colors.primary};">
            <!--[if mso]><i style="letter-spacing: 28px; mso-font-width: -100%; mso-text-raise: 30pt;">&nbsp;</i><![endif]-->
            <span style="mso-text-raise: 15pt;">${text}</span>
            <!--[if mso]><i style="letter-spacing: 28px; mso-font-width: -100%;">&nbsp;</i><![endif]-->
          </a>
        </td>
      </tr>
    </table>
  `;
}

export function Divider(): string {
  return `<hr style="border: none; border-top: 1px solid ${brand.colors.border}; margin: 32px 0;" />`;
}
