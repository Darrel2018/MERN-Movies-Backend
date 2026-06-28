import express from 'express';
import MoviesController from './movies.controller.js';
import ReviewsController from './reviews.controller.js';

const router = express.Router(); // get access to express router

router.route('/').get(MoviesController.apiGetMovies);
router.route("/id/:id").get(MoviesController.apiGetMovieById);
router.route("/ratings").get(MoviesController.apiGetRatings);

router
    .route("/review")
    .post(ReviewsController.apiPostReview)
    .put(ReviewsController.apiUpdateReview)
    .delete(ReviewsController.apiDeleteReview);

export default router;

// This code defines a **simple route module** using Express. Here’s a clear summary:

// * It imports `express` and creates a **router instance** using `express.Router()`. This allows you to define routes separately from the main app.

// * It sets up a route:

//   * A **GET request to the root path (`/`)** will respond with the text `"hello world"`.

// * It exports the router so it can be used in other parts of the application (like being mounted in the main server file).

// **In short:**
// This file creates a basic Express router with one endpoint that returns “hello world” when accessed, and makes it available to be plugged into the main app.
