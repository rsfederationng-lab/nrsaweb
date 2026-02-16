import nodemailer from "nodemailer";
import dotenv from "dotenv";
import path from "path";

// Load .env explicitly
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

async function main() {
    const emailUser = process.env.EMAIL_USER || "rsfederationng@gmail.com";

    console.log("🔍 Testing Email Configuration...");
    console.log("User (Resolved):", emailUser);
    console.log("Password Length:", process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : "MISSING");

    if (!process.env.EMAIL_PASSWORD) {
        console.error("❌ Missing EMAIL_PASSWORD in .env");
        return;
    }

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: emailUser,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    try {
        console.log("Attempting to verify transporter connection...");
        await transporter.verify();
        console.log("✅ Transporter connection verified!");

        console.log("Attempting to send test email...");
        const info = await transporter.sendMail({
            from: `"NRSA Test" <${emailUser}>`,
            to: emailUser, // Send to self
            subject: "NRSA Email Test (TS)",
            text: "If you receive this, the email configuration is working.",
            html: "<b>If you receive this, the email configuration is working.</b>",
        });

        console.log("✅ Message sent: %s", info.messageId);
    } catch (error: any) {
        console.error("❌ Email Test Failed:");
        if (error.response) {
            console.error("Response:", error.response);
        }
        console.error("Error Code:", error.code);
        console.error("Error Message:", error.message);
    }
}

main().catch(console.error);
