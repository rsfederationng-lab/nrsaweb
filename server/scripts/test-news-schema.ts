
import { insertNewsSchema } from "../../shared/schema";
import { z } from "zod";

const testPayload = {
    title: "Test News",
    excerpt: "This is a test excerpt",
    content: "This is some test content",
    imageUrl: "",
    isFeatured: false,
    // Simulate invalid date
    publishedAt: "Invalid Date String"
};

console.log("Testing payload:", testPayload);

try {
    // Simulate PATCH request validation
    const parsed = insertNewsSchema.partial().parse(testPayload);
    console.log("✅ Validation successful!");
    console.log("Parsed result:", parsed);

    // check if date is valid
    if (isNaN(parsed.publishedAt?.getTime() || 0)) {
        console.log("⚠️ Result is Invalid Date object");
    }

} catch (error) {
    console.error("❌ Validation failed!");
    if (error instanceof z.ZodError) {
        console.error(JSON.stringify(error.format(), null, 2));
    } else {
        console.error(error);
    }
}
