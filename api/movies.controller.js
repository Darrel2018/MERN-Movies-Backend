import MoviesDAO from '../dao/moviesDAO.js';

export default class MoviesController {

    static async apiGetMovies(req, res, next) {
        const moviesPerPage = req.query.moviesPerPage ?
            parseInt(req.query.moviesPerPage) : 20;

        const page = req.query.page ? parseInt(req.query.page) : 0;

        let filters = {}

        if (req.query.rated) {
            filters.rated = req.query.rated
        }
        else if (req.query.title) {
            filters.title = req.query.title
        }

        const { moviesList, totalNumMovies } = await
            MoviesDAO.getMovies({ filters, page, moviesPerPage });

        let response = {
            movies: moviesList,
            page: page,
            filters: filters,
            entries_per_page: moviesPerPage,
            total_results: totalNumMovies,
        }

        res.json(response);
    }

    static async apiGetMovieById(req, res, next) {

        try {
            let id = req.params.id || {}
            let movie = await MoviesDAO.getMovieById(id);

            if (!movie) {
                res.status(404).json({ error: "not found" });
                return;
            }

            res.json(movie);
        }
        catch (e) {
            console.log(`api, ${e}`);
            res.status(500).json({ error: e });
        }
    }

    static async apiGetRatings(req, res, next) {
        
        try {
            let propertyTypes = await MoviesDAO.getRatings();
            res.json(propertyTypes);
        }
        catch (e) {
            console.log(`api,${e}`);
            res.status(500).json({ error: e });
        }
    }
}

// Summary
// This code defines a **controller class** (`MoviesController`) for handling API requests related to movies. It acts as the middle layer between incoming HTTP requests and the data access layer (`MoviesDAO`). Here’s a clear breakdown:

// ---

// ### 🔹 Overall Purpose

// The controller exposes three API endpoints:

// * Get a list of movies (with pagination and filters)
// * Get a single movie by ID
// * Get available movie ratings

// ---

// ### 🔹 1. `apiGetMovies`

// Handles requests to fetch a **paginated list of movies**.

// * Reads query parameters:

//   * `moviesPerPage` → number of movies per page (default: 20)
//   * `page` → page number (default: 0)
//   * `rated` or `title` → optional filters
// * Builds a `filters` object based on query input
// * Calls `MoviesDAO.getMovies()` with:

//   * filters
//   * page
//   * movies per page
// * Returns a JSON response containing:

//   * list of movies
//   * current page
//   * applied filters
//   * number of entries per page
//   * total number of results

// 👉 In short: **Fetches and returns a filtered, paginated movie list.**

// ---

// ### 🔹 2. `apiGetMovieById`

// Handles requests to fetch **a single movie by its ID**.

// * Extracts `id` from request parameters
// * Calls `MoviesDAO.getMovieById(id)`
// * If no movie is found:

//   * returns `404 Not Found`
// * Otherwise:

//   * returns the movie data as JSON
// * Includes error handling:

//   * logs errors
//   * returns `500 Internal Server Error` if something goes wrong

// 👉 In short: **Fetches one movie by ID with proper error handling.**

// ---

// ### 🔹 3. `apiGetRatings`

// Handles requests to fetch **available movie ratings**.

// * Calls `MoviesDAO.getRatings()`
// * Returns the ratings as JSON
// * Includes error handling similar to the previous method

// 👉 In short: **Returns a list of distinct movie ratings.**

// ---

// ### 🔹 Key Design Notes

// * Uses **async/await** for asynchronous database operations
// * Separates concerns:

//   * Controller → handles HTTP logic
//   * DAO → handles database queries
// * Provides **basic error handling** and **input parsing**

// ---

// ### ✅ One-line Summary

// This controller manages movie-related API endpoints, enabling clients to retrieve paginated movie lists, individual movie details, and available ratings via a clean separation from the data access layer.

