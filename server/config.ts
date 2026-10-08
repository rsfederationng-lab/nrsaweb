import dotenv from 'dotenv';
import path from 'path';

// Resolve from the project root so the server also works when launched by an
// IDE, a process manager, or a deployment service with a different cwd.
const projectRoot = process.cwd();
const isProduction = process.env.NODE_ENV === "production";
dotenv.config({ path: path.join(projectRoot, '.env.local'), override: !isProduction });
dotenv.config({ path: path.join(projectRoot, '.env'), override: !isProduction });
