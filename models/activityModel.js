const mongoose = require('mongoose');
const { ActivityStatus, CategoryType } = require('../utils/enum');
const User = require('../models/userModel');
const activitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide activity title'],
      trim: true,
      maxlength: [255, 'Title cannot be longer than 255 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide activity description'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Please provide activity location'],
      trim: true,
    },
    map_url: {
      type: String,
      required: [true, 'Map URL is required'],
    },
    latitude: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90'],
    },
    longitude: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180'],
    },
    start_date: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    end_date: {
      type: Date,
      required: [true, 'End date is required'],
    },
    status: {
      type: String,
      enum: Object.values(ActivityStatus),
      default: ActivityStatus.UPCOMING,
    },
    category: {
      type: String,
      enum: Object.values(CategoryType),
      required: [true, 'Category is required'],
    },
    price: {
      type: mongoose.Decimal128,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      set: function (value) {
        return mongoose.Types.Decimal128.fromString(value.toString());
      },
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
