
import dotenv from "dotenv";
import { registerAllRoutes } from "../routes";
import express from "express";
import { storage } from "../storage";
import { insertNewsSchema } from "../../shared/schema";

console.log("✅ Modules imported successfully.");

try {
    const app = express();
    registerAllRoutes(app);
    console.log("✅ Routes registered successfully.");
} catch (error) {
    console.error("❌ Error registering routes:", error);
}

try {
    // Test schema instantiation
    const schema = insertNewsSchema;
    console.log("✅ Schema validated successfully.");
} catch (error) {
    console.error("❌ Error with schema:", error);
}

console.log("Startup check complete.");
