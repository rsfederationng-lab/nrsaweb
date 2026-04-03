// Vercel Serverless Function Entry Point
// This file is kept as plain JS so Vercel picks it up as a serverless function.
// The bundled Express app is in ./server.js (compiled during vercel:build).

import app from './server.js';

export default app;
