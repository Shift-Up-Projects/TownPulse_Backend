const Attendance = require('../models/attendanceModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');
const { AttendanceStatus } = require('../utils/enum');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');
const factory = require('../utils/handlerFactory');

exports.getAllAttendance = factory.getAll(Attendance);
exports.getAttendance = factory.getOne(Attendance);
exports.updateAttendance = factory.updateOne(Attendance);
exports.deleteAttendance = factory.deleteOne(Attendance);

exports.createAttendance = catchAsync(async (req, res, next) => {
  const { user_id, activity_id, status, attended_at } = req.body;

  if (status && !Object.values(AttendanceStatus).includes(status)) {
    return next(new AppError('Invalid attendance status', 400));
  }

  const activity = await Activity.findById(activity_id);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  const user = await User.findById(user_id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const existingAttendance = await Attendance.findOne({
    user_id,
    activity_id,
  });

  if (existingAttendance) {
    return next(new AppError('User already registered for this activity', 400));
  }

  const attendance = await Attendance.create({
    user_id,
    activity_id,
    status: status || AttendanceStatus.PRESENT,
    attended_at: attended_at || new Date(),
  });

  const populatedAttendance = await Attendance.findById(attendance._id)
    .populate('user_id', 'name email profile_image')
    .populate('activity_id', 'title start_date location');

  res.status(201).json({
    isSuccess: true,
    message: 'Attendance created successfully',
    statusCode: 201,
    data: populatedAttendance,
  });
});

exports.getMyAttendance = catchAsync(async (req, res, next) => {
  const { page = 1, limit = 10, status, activity_id } = req.query;
  const userId = req.user._id;

  const filter = { user_id: userId };
  if (status && Object.values(AttendanceStatus).includes(status)) {
    filter.status = status;
  }
  if (activity_id) {
    filter.activity_id = activity_id;
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(parseInt(limit) || 10, 100)); // حد أقصى 100
  const skip = (pageNum - 1) * limitNum;

  const attendance = await Attendance.find(filter)
    .populate('activity_id', 'title start_date end_date location category')
    .populate('user_id', 'name email profile_image')
    .sort({ attended_at: -1 })
    .limit(limitNum)
    .skip(skip);
  
  const total = await Attendance.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    isSuccess: true,
    message: `${attendance.length} attendance records fetched from your history`,
    statusCode: 200,
    data: {
      attendance,
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalRecords: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    },
  });
});

exports.getActivityAttendance = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;
  const { page = 1, limit = 50, status } = req.query;

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  const filter = { activity_id: activityId };

  if (status && Object.values(AttendanceStatus).includes(status)) {
    filter.status = status;
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(parseInt(limit) || 50, 100)); // حد أقصى 100
  const skip = (pageNum - 1) * limitNum;

  const attendance = await Attendance.find(filter)
    .populate('user_id', 'name email profile_image phone')
    .sort({ attended_at: -1 })
    .limit(limitNum)
    .skip(skip);

  const total = await Attendance.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum);

  const stats = await Attendance.aggregate([
    {
      $match: { activity_id: activity._id },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const statsObject = {};
  stats.forEach((stat) => {
    statsObject[stat._id] = stat.count;
  });

  res.status(200).json({
    isSuccess: true,
    message: `${attendance.length} attendance records fetched for this activity`,
    statusCode: 200,
    data: {
      attendance,
      activityInfo: {
        _id: activity._id,
        title: activity.title,
        start_date: activity.start_date,
        location: activity.location,
        capacity: activity.capacity,
      },
      statistics: {
        total_attendance: total,
        attendance_rate:
          activity.capacity > 0
            ? ((total / activity.capacity) * 100).toFixed(2)
            : 0,
        status_breakdown: statsObject,
      },
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalRecords: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    },
  });
});

exports.getUserAttendance = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const { page = 1, limit = 10, status } = req.query;

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  const filter = { user_id: userId };

  if (status && Object.values(AttendanceStatus).includes(status)) {
    filter.status = status;
  }

  const pageNum = Math.max(1, parseInt(page) || 1);
  const limitNum = Math.max(1, Math.min(parseInt(limit) || 10, 100)); // حد أقصى 100
  const skip = (pageNum - 1) * limitNum;

  const attendance = await Attendance.find(filter)
    .populate('activity_id', 'title start_date end_date location category')
    .sort({ attended_at: -1 })
    .limit(limitNum)
    .skip(skip);

  const total = await Attendance.countDocuments(filter);
  const totalPages = Math.ceil(total / limitNum);

  res.status(200).json({
    isSuccess: true,
    message: `${attendance.length} attendance records fetched for user`,
    statusCode: 200,
    data: {
      attendance,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      pagination: {
        currentPage: pageNum,
        totalPages: totalPages,
        totalRecords: total,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
        limit: limitNum
      }
    },
  });
});