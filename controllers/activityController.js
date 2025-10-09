const Activity = require('../models/activityModel');
const { CategoryType } = require('../utils/enum');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const calculateDistance = require('../middlewares/activityMiddleware');
const factory = require('../utils/handlerFactory');

exports.getAllActivities = factory.getAll(Activity);
exports.getActivity = factory.getOne(Activity, {
  path: 'creator',
  select: 'name email profile_image',
});
exports.updateActivity = factory.updateOne(Activity);
exports.deleteActivity = factory.deleteOne(Activity);
exports.createActivity = catchAsync(async (req, res, next) => {
  const {
    title,
    description,
    location,
    map_url,
    latitude,
    longitude,
    start_date,
    end_date,
    price,
    capacity,
    category,
  } = req.body;
  if (category && !Object.values(CategoryType).includes(category)) {
    return next(new AppError('Invalid category type', 400));
  }
  const activity = await Activity.create({
    title: title?.trim(),
    description: description?.trim(),
    location: location?.trim(),
    map_url: map_url?.trim(),
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    start_date: new Date(start_date),
    end_date: new Date(end_date),
    price: parseFloat(price),
    capacity: parseInt(capacity),
    category: category,
    creator: req.user._id,
  });
  const populatedActivity = await Activity.findById(activity._id).populate(
    'creator',
    'name email profile_image',
  );
  res.status(201).json({
    isSuccess: true,
    message: 'Activity created successfully',
    statusCode: 201,
    data: populatedActivity,
  });
});

exports.getNearbyActivities = catchAsync(async (req, res, next) => {
  const { lat, lng, maxDistance = 10, page = 1, limit = 10 } = req.query;

  if (!lat || !lng) {
    return next(new AppError('Latitude and longitude must be provided.', 400));
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const distance = parseFloat(maxDistance);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(distance)) {
    return next(new AppError('Invalid coordinates or distance', 400));
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return next(new AppError('Coordinates outside the allowed range', 400));
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const activities = await Activity.find({
    latitude: { $exists: true, $ne: null },
    longitude: { $exists: true, $ne: null },
    start_date: { $gte: new Date() },
  })
    .where('latitude')
    .gte(latitude - distance / 111.32)
    .where('latitude')
    .lte(latitude + distance / 111.32)
    .where('longitude')
    .gte(longitude - distance / (111.32 * Math.cos((latitude * Math.PI) / 180)))
    .where('longitude')
    .lte(longitude + distance / (111.32 * Math.cos((latitude * Math.PI) / 180)))
    .populate('creator', 'name email profile_image')
    .sort({ start_date: 1 })
    .limit(limitNum)
    .skip(skip);

  const total = await Activity.countDocuments({
    latitude: { $exists: true, $ne: null },
    longitude: { $exists: true, $ne: null },
    start_date: { $gte: new Date() },
    latitude: {
      $gte: latitude - distance / 111.32,
      $lte: latitude + distance / 111.32,
    },
    longitude: {
      $gte:
        longitude - distance / (111.32 * Math.cos((latitude * Math.PI) / 180)),
      $lte:
        longitude + distance / (111.32 * Math.cos((latitude * Math.PI) / 180)),
    },
  });

  const activitiesWithDistance = activities.map((activity) => {
    const distance = calculateDistance(
      latitude,
      longitude,
      activity.latitude,
      activity.longitude,
    );

    return {
      ...activity.toObject(),
      distance: Math.round(distance * 10) / 10,
    };
  });

  activitiesWithDistance.sort((a, b) => a.distance - b.distance);

  res.status(200).json({
    isSuccess: true,
    message: '${activitiesWithDistance.length} activity found nearby',
    statusCode: 200,
    data: {
      activities: activitiesWithDistance,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalActivities: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      searchLocation: {
        latitude: latitude,
        longitude: longitude,
        maxDistance: distance,
      },
    },
  });
});
exports.getMyActivities = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, category } = req.query;
  const userId = req.user._id;

  // بناء الفلتر الأساسي
  const filter = { creator: userId };

  // تصفية حسب الحالة
  if (status === 'upcoming') {
    filter.start_date = { $gte: new Date() };
  } else if (status === 'past') {
    filter.end_date = { $lt: new Date() };
  } else if (status === 'ongoing') {
    filter.start_date = { $lte: new Date() };
    filter.end_date = { $gte: new Date() };
  }

  // تصفية حسب الفئة
  if (category && Object.values(CategoryType).includes(category)) {
    filter.category = category;
  }

  // إعداد الباجينيشين
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // الاستعلام
  const activities = await Activity.find(filter)
    .populate('creator', 'name email profile_image')
    .sort({ start_date: 1 })
    .limit(limitNum)
    .skip(skip);

  // العدد الكلي
  const total = await Activity.countDocuments(filter);

  res.status(200).json({
    isSuccess: true,
    message: '${activities.length} was fetched from your activities.',
    statusCode: 200,
    data: {
      activities,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalActivities: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      filters: {
        status: status || 'all',
        category: category || 'all',
      },
    },
  });
});
exports.getUserActivities = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status, category } = req.query;

  // بناء الفلتر الأساسي
  const filter = { creator: userId };

  // تصفية حسب الحالة
  if (status === 'upcoming') {
    filter.start_date = { $gte: new Date() };
  } else if (status === 'past') {
    filter.end_date = { $lt: new Date() };
  } else if (status === 'ongoing') {
    filter.start_date = { $lte: new Date() };
    filter.end_date = { $gte: new Date() };
  }

  // تصفية حسب الفئة
  if (category && Object.values(CategoryType).includes(category)) {
    filter.category = category;
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // الاستعلام
  const activities = await Activity.find(filter)
    .populate('creator', 'name email profile_image')
    .sort({ start_date: 1 })
    .limit(limitNum)
    .skip(skip);

  // العدد الكلي
  const total = await Activity.countDocuments(filter);

  res.status(200).json({
    isSuccess: true,
    message: `${activities.length} activity fetched for user`,
    statusCode: 200,
    data: {
      activities,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(total / limitNum),
        totalActivities: total,
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1,
      },
      userInfo: {
        userId: userId,
      },
      filters: {
        status: status || 'all',
        category: category || 'all',
      },
    },
  });
});
