const Attendance = require('../models/attendanceModel');
const Activity = require('../models/activityModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const { AttendanceStatus } = require('../utils/enum');

exports.validateQueryParams = catchAsync(async (req, res, next) => {
  const { page, limit, status, activity_id } = req.query;

  // Validate pagination parameters
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return next(new AppError('Page must be a positive number', 400));
  }

  if (limit && (isNaN(limit) || parseInt(limit) < 1)) {
    return next(new AppError('Limit must be a positive number', 400));
  }

  // Validate status
  if (status && !Object.values(AttendanceStatus).includes(status)) {
    return next(new AppError('Invalid attendance status', 400));
  }

  // Validate activity_id format
  if (activity_id && !activity_id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid activity ID format', 400));
  }

  next();
});
exports.validateCreateAttendance = catchAsync(async (req, res, next) => {
  const { user_id, activity_id, status, attended_at } = req.body;

  // Check required fields
  if (!user_id || !activity_id) {
    return next(new AppError('User ID and Activity ID are required', 400));
  }

  // Validate ID formats
  if (!user_id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid user ID format', 400));
  }

  if (!activity_id.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid activity ID format', 400));
  }

  // Validate status
  if (status && !Object.values(AttendanceStatus).includes(status)) {
    return next(new AppError('Invalid attendance status', 400));
  }

  // Validate attended_at date format
  if (attended_at) {
    const attendedDate = new Date(attended_at);
    if (isNaN(attendedDate.getTime())) {
      return next(new AppError('Invalid attended_at date format', 400));
    }

    // Check if attended_at is not in the future
    if (attendedDate > new Date()) {
      return next(new AppError('Attendance date cannot be in the future', 400));
    }
  }

  // Check if activity exists
  const activity = await Activity.findById(activity_id);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Check if user exists
  const user = await User.findById(user_id);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check for duplicate attendance
  const existingAttendance = await Attendance.findOne({
    user_id,
    activity_id,
  });

  if (existingAttendance) {
    return next(new AppError('User already registered for this activity', 400));
  }

  next();
});
exports.validateActivityId = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;

  if (!activityId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid activity ID format', 400));
  }

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  req.activity = activity;
  next();
});
exports.validateUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid user ID format', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  req.requestedUser = user;
  next();
});
exports.checkAttendanceOwner = catchAsync(async (req, res, next) => {
  const attendanceId = req.params.id;
  const currentUserId = req.user._id;

  if (!attendanceId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid attendance ID format', 400));
  }

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return next(new AppError('Attendance record not found', 404));
  }

  // Allow admin to modify any attendance record
  if (req.user.role === 'ADMIN') {
    req.attendance = attendance;
    return next();
  }

  // Check if current user owns the attendance record
  if (attendance.user_id.toString() !== currentUserId.toString()) {
    return next(
      new AppError('You are not authorized to perform this action', 403),
    );
  }

  req.attendance = attendance;
  next();
});

exports.validateAttendanceId = catchAsync(async (req, res, next) => {
  const attendanceId = req.params.id;

  if (!attendanceId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid attendance ID format', 400));
  }

  const attendance = await Attendance.findById(attendanceId);
  if (!attendance) {
    return next(new AppError('Attendance record not found', 404));
  }

  req.attendance = attendance;
  next();
});

exports.restrictToActivityOwner = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;
  const currentUserId = req.user._id;

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  // Allow admin to access any activity attendance
  if (req.user.role === 'ADMIN') {
    return next();
  }

  // Check if current user is the activity creator
  if (activity.creator.toString() !== currentUserId.toString()) {
    return next(
      new AppError(
        'You are not authorized to view attendance for this activity',
        403,
      ),
    );
  }

  next();
});

exports.validateStatsParams = catchAsync(async (req, res, next) => {
  const { activityId } = req.params;

  if (!activityId.match(/^[0-9a-fA-F]{24}$/)) {
    return next(new AppError('Invalid activity ID format', 400));
  }

  const activity = await Activity.findById(activityId);
  if (!activity) {
    return next(new AppError('Activity not found', 404));
  }

  req.activity = activity;
  next();
});
