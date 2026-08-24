// @shared/schema.ts (Conceptual addition)

import { insertEventSchema } from "./schema"; // Ensure this import is correct
import { z } from "zod";

// Create a schema where all fields are optional, but keeps the original types/refines
export const updateEventSchema = insertEventSchema.partial(); 

// Export this new schema so it can be imported in the route file