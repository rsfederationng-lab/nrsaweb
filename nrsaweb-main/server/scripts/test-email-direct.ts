
import { verifyEmailConnection, sendContactEmails } from "../mail";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables from .env file in the root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

console.log("Checking environment variables...");
console.log("EMAIL_USER:", process.env.EMAIL_USER || "rsfederationng@gmail.com (default)");
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "****" : "MISSING");

async function testEmail() {
    console.log("\n1. Verifying SMTP Connection...");
    const connectionResult = await verifyEmailConnection();
    console.log("Connection Result:", connectionResult);

    if (connectionResult.success) {
        console.log("\n2. Sending Test Email...");
        const sendResult = await sendContactEmails({
            name: "Test User",
            email: "test_recipient@example.com", // We can't easily check this inbox, but we can check if the send call succeeds
            type: "General",
            message: "This is a test message from the verification script.",
            subject: "Test Subject",
            phone: "1234567890"
        });

        if (sendResult) {
            console.log("✅ Email send function returned success.");
        } else {
            console.error("❌ Email send function returned failure.");
        }
    } else {
        console.error("❌ Skipping send test due to connection failure.");
    }
}

testEmail().catch(console.error);
