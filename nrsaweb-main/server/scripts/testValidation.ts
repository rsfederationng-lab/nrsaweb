
import { insertAffiliationSchema } from '../../shared/schema';

const payload = {
    name: "Test Org",
    logoUrl: "", // Frontend sends empty string if not uploaded
    website: "", // Frontend sends empty string
    description: "", // Frontend sends empty string
    order: 0
};

try {
    console.log("Testing payload:", payload);
    const result = insertAffiliationSchema.parse(payload);
    console.log("✅ Validation successful:", result);
} catch (e: any) {
    console.error("❌ Validation failed:");
    if (e.errors) {
        console.error(JSON.stringify(e.errors, null, 2));
    } else {
        console.error(e);
    }
}
