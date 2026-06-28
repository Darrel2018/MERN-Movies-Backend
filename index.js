import app from './server.js';
import mongodb from "mongodb";
import dotenv from "dotenv";
import MoviesDAO from './dao/moviesDAO.js';
import ReviewsDAO from './dao/reviewsDAO.js';

async function main() {
    dotenv.config();

    const client = new mongodb.MongoClient(
        process.env.MOVIEREVIEWS_DB_URI
    );

    const port = process.env.PORT || 8000;

    try {
        // Connect to the MongoDB cluster
        await client.connect();
        await MoviesDAO.injectDB(client);
        await ReviewsDAO.injectDB(client);

        app.listen(port, () => {
            console.log('server is running on port:' + port + "base url = localhost:5000");
        })
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

main().catch(console.error);

// This code is responsible for **starting the server and connecting it to a MongoDB database**. Here’s a clear breakdown:

// * It imports:

//   * the configured Express app from `server.js`
//   * the `mongodb` driver to connect to MongoDB
//   * `dotenv` to load environment variables from a `.env` file

// * It defines an async `main()` function to handle setup.

// * Inside `main()`:

//   * `dotenv.config()` loads environment variables (like database URI and port).
//   * A new MongoDB client is created using `process.env.MOVIEREVIEWS_DB_URI`.
//   * The server port is set from `process.env.PORT`, defaulting to `8000` if not provided.

// * It then attempts to:

//   * Connect to the MongoDB database.
//   * Start the Express server with `app.listen(port)` once the database connection is successful.

// * Error handling:

//   * If the database connection fails, it logs the error and exits the process.
//   * Any unhandled errors in `main()` are caught and logged.

// **In short:**
// This file initializes environment settings, connects to MongoDB, and starts the Express server—ensuring the app only runs if the database connection is successful.

