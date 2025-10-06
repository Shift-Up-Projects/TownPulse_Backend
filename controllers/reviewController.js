const Review = require('../models/reviewModel');
const Activity = require('../models/activityModel');
const asyncHandler = require('express-async-handler');

const createReview = asyncHandler(async (req, res) => {
  const { activity_id, rating, comment } = req.body;
  const user_id = req.user.id;

  const activity = await Activity.findById(activity_id);
  if (!activity) {
    res.status(404);
    throw new Error('Activity not found');
  }
  const existingReview = await Review.findOne({ 
    user_id, 
    activity_id 
  });
  
  if (existingReview) {
    res.status(400);
    throw new Error('You have already reviewed this activity');
  }

  const review = await Review.create({
    user_id,
    activity_id,
    rating,
    comment
  });

  await review.populate('user_id', 'name email');

  res.status(201).json({
    isSuccess: true,
    message: "success, Review created successfully",
    statusCode: 201,
    data: review
  });
});

const getAllReviews = asyncHandler(async (req, res) => {
  const { activity_id, user_id, page = 1, limit = 10 } = req.query;
  let filter = {};
  
  if (activity_id) {
    filter.activity_id = activity_id;
  }
  
  if (user_id) {
    filter.user_id = user_id;
  }

  const reviews = await Review.find(filter)
    .populate('user_id', 'name email')
    .populate('activity_id', 'title')
    .sort({ created_at: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

  const total = await Review.countDocuments(filter);
  const count = reviews.length;

  res.json({
    isSuccess: true,
    message: `Success, number of documents ${count}`,
    statusCode: 200,
    data: reviews
  });
});

const getOneReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id)
    .populate('user_id', 'name email')
    .populate('activity_id', 'title location');

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  res.json({
    isSuccess: true,
    message: "success, Review retrieved successfully",
    statusCode: 200,
    data: review
  });
});

const updateReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const user_id = req.user.id;

  let review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  // Check if user owns the review
  if (review.user_id.toString() !== user_id) {
    res.status(403);
    throw new Error('Not authorized to update this review');
  }

  review = await Review.findByIdAndUpdate(
    req.params.id,
    { 
      rating, 
      comment,
      updated_at: Date.now()
    },
    { 
      new: true, 
      runValidators: true 
    }
  ).populate('user_id', 'name email')
   .populate('activity_id', 'title');

  res.json({
    isSuccess: true,
    message: "success, Review updated successfully",
    statusCode: 200,
    data: review
  });
});

const deleteReview = asyncHandler(async (req, res) => {
  const user_id = req.user.id;
  const review = await Review.findById(req.params.id);

  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.user_id.toString() !== user_id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this review');
  }

  await Review.findByIdAndDelete(req.params.id);

  res.json({
    isSuccess: true,
    message: "success, Review deleted successfully",
    statusCode: 200,
    data: null
  });
});

module.exports = {
  createReview,
  getAllReviews,
  getOneReview,
  updateReview,
  deleteReview
};