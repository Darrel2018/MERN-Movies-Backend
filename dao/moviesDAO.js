import mongodb from "mongodb";

import { ObjectId } from 'mongodb';
// const ObjectId = mongodb.ObjectID;

let movies;

export default class MoviesDAO {

    static async injectDB(conn) {
        if (movies) {
            return;
        }

        try {
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
                .collection('movies');
        }
        catch (e) {
            console.error(`unable to connect in MoviesDAO: ${e}`);
        }
    }

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}) {

        let query;

        if (filters) {
            if ("title" in filters) {
                query = { $text: { $search: filters['title'] } }
            } else if ("rated" in filters) {
                query = { "rated": { $eq: filters['rated'] } }
            }
        }

        let cursor;

        try {
            cursor = await movies
                .find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page)
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return { moviesList, totalNumMovies }
        }
        catch (e) {
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0 }
        }
    }

    static async getRatings() {
        let ratings = [];

        try {
            ratings = await movies.distinct("rated");
            return ratings
        }
        catch (e) {
            console.error(`unable to get ratings, $(e)`);
            return ratings
        }
    }

    static async getMovieById(id) {

        try {
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                {
                    $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }
            ]).next()
        }
        catch (e) {
            console.error(`something went wrong in getMovieById: ${e}`)
            throw e
        }
    }
}

// Summary
// This code defines a **Data Access Object (DAO)** class (`MoviesDAO`) responsible for interacting directly with a MongoDB database. It handles all database operations related to movies and is used by the controller layer.

// ---

// ### 🔹 Overall Purpose

// `MoviesDAO` provides methods to:

// * Connect to the database
// * Fetch movies with filters and pagination
// * Retrieve distinct ratings
// * Fetch a single movie along with its reviews

// ---

// ### 🔹 1. `injectDB`

// Initializes the database connection.

// * Accepts a database connection (`conn`)
// * Prevents re-initialization if already connected
// * Connects to:

//   * database: `process.env.MOVIEREVIEWS_NS`
//   * collection: `movies`
// * Stores the collection reference in a shared variable (`movies`)

// 👉 In short: **Sets up and caches the MongoDB movies collection.**

// ---

// ### 🔹 2. `getMovies`

// Fetches a **list of movies with optional filters and pagination**.

// * Parameters:

//   * `filters` (title or rating)
//   * `page` (default: 0)
//   * `moviesPerPage` (default: 20)
// * Builds a MongoDB query:

//   * Text search on `title` using `$text`
//   * Exact match on `rated`
// * Executes query with:

//   * `.limit()` → restrict results per page
//   * `.skip()` → paginate results
// * Returns:

//   * `moviesList` → array of movies
//   * `totalNumMovies` → total matching documents

// 👉 In short: **Queries movies with filtering + pagination support.**

// ---

// ### 🔹 3. `getRatings`

// Retrieves **all unique movie ratings**.

// * Uses MongoDB’s `.distinct("rated")`
// * Returns an array of ratings (e.g., PG, R, etc.)

// 👉 In short: **Gets a list of distinct rating values.**

// ---

// ### 🔹 4. `getMovieById`

// Fetches a **single movie and its associated reviews**.

// * Converts `id` into a MongoDB `ObjectId`
// * Uses an **aggregation pipeline**:

//   1. `$match` → finds the movie by `_id`
//   2. `$lookup` → joins with the `reviews` collection

//      * Matches `movie_id` in reviews with `_id` in movies
//      * Outputs reviews as an array field
// * Returns the first matched document using `.next()`

// 👉 In short: **Fetches a movie and embeds its related reviews.**

// ---

// ### 🔹 Key Design Notes

// * Uses MongoDB native driver (`mongodb`)
// * Implements **separation of concerns**:

//   * DAO → database logic
//   * Controller → request/response handling
// * Supports:

//   * Pagination (`limit`, `skip`)
//   * Full-text search (`$text`)
//   * Aggregation (`$lookup` for joins)
// * Includes error handling with fallback values

// ---

// ### ✅ One-line Summary

// This DAO class manages all MongoDB operations for movies, including querying with filters and pagination, retrieving ratings, and fetching detailed movie records with their associated reviews.


