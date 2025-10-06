const mongoose = require('mongoose');
const User=require('../models/userModel');
const Activity=require('../models/activityModel');
const reviewSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    activity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Activity',
      required: [true, 'Activity ID is required'],
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    comment: {
      type: String,
      trim: true,
    }
  },
  {
    timestamps: true,
    versionKey: false,
  },
);
const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;