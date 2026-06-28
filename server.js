import express from 'express';
import cors from 'cors';
import movies from './api/movies.route.js';

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1/movies", movies);

app.use('', (req, res) => {
    res.status(404).json({ error: "not found" });
});

export default app;

// This code sets up a basic backend server using **Express.js**. Here’s a clear summary of what it does:

// * It imports required modules:

//   * `express` for creating the server
//   * `cors` to allow cross-origin requests
//   * a custom `movies` route handler

// * It creates an Express application (`app`).

// * Middleware setup:

//   * `cors()` enables requests from different origins (useful for frontend-backend communication).
//   * `express.json()` allows the server to parse incoming JSON request bodies.

// * Routing:

//   * All requests starting with `/api/v1/movies` are handled by the `movies` router module.

// * Error handling:

//   * Any request that doesn’t match existing routes returns a **404 "not found"** JSON response.

// * Finally, it exports the configured Express app so it can be used elsewhere (e.g., in a server startup file).

// **In short:**
// This file initializes an Express server, enables JSON and CORS support, connects a movies API route, and provides a fallback for unknown endpoints.

