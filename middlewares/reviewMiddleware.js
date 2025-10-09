const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Activity = require('../models/activityModel');

const validateCreateReview = asyncHandler(async (req, res, next) => {
  const { activity_id, rating, comment } = req.body;

  if (!activity_id || !rating) {
    res.status(400);
    throw new Error('Activity ID and rating are required');
  }

  if (rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  next();
});

const validateUpdateReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  if (rating && (rating < 1 || rating > 5)) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  next();
});

const validateReviewId = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  next();
});

const validateActivityId = asyncHandler(async (req, res, next) => {
  const activity = await Activity.findById(req.params.activityId);

  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }

  next();
});

const checkReviewOwner = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (review.user_id.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to perform this action');
  }

  next();
});

const validateQueryParams = asyncHandler(async (req, res, next) => {
  const { page, limit } = req.query;

  if (page && parseInt(page) < 1) {
    res.status(400);
    throw new Error('Page must be greater than 0');
  }

  if (limit && parseInt(limit) < 1) {
    res.status(400);
    throw new Error('Limit must be greater than 0');
  }

  next();
});

module.exports = {
  validateCreateReview,
  validateUpdateReview,
  validateReviewId,
  validateActivityId,
  checkReviewOwner,
  validateQueryParams,
};
