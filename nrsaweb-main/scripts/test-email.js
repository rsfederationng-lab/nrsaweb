const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
    console.log("🔍 Testing Email Configuration (JS Mode)...");
    console.log("User:", process.env.EMAIL_USER);
    console.log("Password:", process.env.EMAIL_PASSWORD ? "*****" : "MISSING");

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.error("❌ Missing EMAIL_USER or EMAIL_PASSWORD in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log("Attempting to verify transporter connection...");
        await transporter.verify();
        console.log("✅ Transporter connection verified!");

        console.log("Attempting to send test email...");
        const info = await transporter.sendMail({
            from: `"NRSA Test" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_USER, // Send to self
            subject: "NRSA Email Test (JS)",
            text: "If you receive this, the email configuration is working.",
            html: "<b>If you receive this, the email configuration is working.</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error) {
        console.error("❌ Email Test Failed:");
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
        if (error.response) {
            console.error("Response:", error.response);
        }
    }
}

main().catch(console.error);
