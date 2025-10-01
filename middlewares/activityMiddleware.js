// middlewares/activityMiddleware.js
const Activity = require('../models/activityModel');
const { CategoryType } = require('../utils/enum');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

// ✅ دالة حساب المسافة باستخدام Haversine formula
exports.calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // نصف قطر الأرض بالكيلومتر
  
  // تحويل الدرجات إلى راديان
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  
  return distance;
};

// ✅ دالة مساعدة للتحقق من صحة التواريخ
const validateActivityDates = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (start < now) {
    return 'تاريخ البدء لا يمكن أن يكون في الماضي';
  }

  if (end <= start) {
    return 'تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء';
  }

  return null;
};

// ✅ التحقق من ملكية الفعالية
exports.checkActivityOwner = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({
      isSuccess: false,
      message: 'الفعالية غير موجودة',
      statusCode: 404,
      data: null,
    });
  }

  if (activity.creator.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      isSuccess: false,
      message: 'غير مصرح لك بتعديل هذه الفعالية',
      statusCode: 403,
      data: null,
    });
  }

  req.activity = activity;
  next();
});

// ✅ التحقق من وجود الفعالية
exports.checkActivityExists = catchAsync(async (req, res, next) => {
  const activity = await Activity.findById(req.params.id);

  if (!activity) {
    return res.status(404).json({
      isSuccess: false,
      message: 'الفعالية غير موجودة',
      statusCode: 404,
      data: null,
    });
  }

  req.activity = activity;
  next();
});

// ✅ التحقق من صحة الإحداثيات
exports.validateCoordinates = catchAsync(async (req, res, next) => {
  const { lat, lng } = req.query;

  if (lat && lng) {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        isSuccess: false,
        message: 'قيمة خط العرض غير صالحة',
        statusCode: 400,
        data: null,
      });
    }

    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        isSuccess: false,
        message: 'قيمة خط الطول غير صالحة',
        statusCode: 400,
        data: null,
      });
    }
  }

  next();
});

// ✅ التحقق من الحقول المطلوبة لإنشاء فعالية
exports.validateCreateActivity = catchAsync(async (req, res, next) => {
  const requiredFields = [
    'title',
    'description',
    'location',
    'start_date',
    'end_date',
    'price',
    'capacity',
    'category',
  ];

  const missingFields = requiredFields.filter((field) => !req.body[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      isSuccess: false,
      message: `الحقول المطلوبة مفقودة: ${missingFields.join(', ')}`,
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الفئة
  if (!Object.values(CategoryType).includes(req.body.category)) {
    return res.status(400).json({
      isSuccess: false,
      message: `الفئة غير صالحة. يجب أن تكون واحدة من: ${Object.values(CategoryType).join(', ')}`,
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة التواريخ
  const dateError = validateActivityDates(req.body.start_date, req.body.end_date);
  if (dateError) {
    return res.status(400).json({
      isSuccess: false,
      message: dateError,
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الإحداثيات إذا تم إرسالها
  if (req.body.latitude !== undefined) {
    const latitude = parseFloat(req.body.latitude);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        isSuccess: false,
        message: 'خط العرض يجب أن يكون رقم صحيح بين -90 و 90',
        statusCode: 400,
        data: null,
      });
    }
  }

  if (req.body.longitude !== undefined) {
    const longitude = parseFloat(req.body.longitude);
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        isSuccess: false,
        message: 'خط الطول يجب أن يكون رقم صحيح بين -180 و 180',
        statusCode: 400,
        data: null,
      });
    }
  }

  // التحقق من صحة السعر والسعة
  if (req.body.price < 0) {
    return res.status(400).json({
      isSuccess: false,
      message: 'السعر لا يمكن أن يكون سالب',
      statusCode: 400,
      data: null,
    });
  }

  if (req.body.capacity < 1) {
    return res.status(400).json({
      isSuccess: false,
      message: 'السعة يجب أن تكون على الأقل 1',
      statusCode: 400,
      data: null,
    });
  }

  next();
});

// ✅ التحقق من صحة البيانات للتحديث
exports.validateUpdateActivity = catchAsync(async (req, res, next) => {
  const allowedFields = [
    'title', 'description', 'location', 'map_url', 
    'latitude', 'longitude', 'start_date', 'end_date', 
    'price', 'capacity', 'category'
  ];

  // التحقق من وجود حقول غير مسموح بها
  const invalidFields = Object.keys(req.body).filter(field => !allowedFields.includes(field));
  if (invalidFields.length > 0) {
    return res.status(400).json({
      isSuccess: false,
      message: `حقول غير مسموحة: ${invalidFields.join(', ')}`,
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الفئة إذا تم إرسالها
  if (req.body.category && !Object.values(CategoryType).includes(req.body.category)) {
    return res.status(400).json({
      isSuccess: false,
      message: `الفئة غير صالحة. يجب أن تكون واحدة من: ${Object.values(CategoryType).join(', ')}`,
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة التواريخ إذا تم إرسالها
  if (req.body.start_date || req.body.end_date) {
    const startDate = req.body.start_date || req.activity.start_date;
    const endDate = req.body.end_date || req.activity.end_date;
    const dateError = validateActivityDates(startDate, endDate);
    if (dateError) {
      return res.status(400).json({
        isSuccess: false,
        message: dateError,
        statusCode: 400,
        data: null,
      });
    }
  }

  // التحقق من صحة الإحداثيات إذا تم إرسالها
  if (req.body.latitude !== undefined) {
    const latitude = parseFloat(req.body.latitude);
    if (isNaN(latitude) || latitude < -90 || latitude > 90) {
      return res.status(400).json({
        isSuccess: false,
        message: 'خط العرض يجب أن يكون رقم صحيح بين -90 و 90',
        statusCode: 400,
        data: null,
      });
    }
  }

  if (req.body.longitude !== undefined) {
    const longitude = parseFloat(req.body.longitude);
    if (isNaN(longitude) || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        isSuccess: false,
        message: 'خط الطول يجب أن يكون رقم صحيح بين -180 و 180',
        statusCode: 400,
        data: null,
      });
    }
  }

  // التحقق من صحة السعر إذا تم إرساله
  if (req.body.price !== undefined && req.body.price < 0) {
    return res.status(400).json({
      isSuccess: false,
      message: 'السعر لا يمكن أن يكون سالب',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة السعة إذا تم إرسالها
  if (req.body.capacity !== undefined) {
    if (req.body.capacity < 1) {
      return res.status(400).json({
        isSuccess: false,
        message: 'السعة يجب أن تكون على الأقل 1',
        statusCode: 400,
        data: null,
      });
    }
    if (req.body.capacity < req.activity.participants.length) {
      return res.status(400).json({
        isSuccess: false,
        message: `السعة لا يمكن أن تكون أقل من عدد المشاركين الحالي (${req.activity.participants.length})`,
        statusCode: 400,
        data: null,
      });
    }
  }

  next();
});

// ✅ التحقق من صحة معرّف المستخدم
exports.validateUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId || userId.length !== 24) {
    return res.status(400).json({
      isSuccess: false,
      message: 'معرّف المستخدم غير صالح',
      statusCode: 400,
      data: null,
    });
  }

  // يمكنك إضافة تحقق إضافي من وجود المستخدم في قاعدة البيانات
  // const userExists = await User.findById(userId);
  // if (!userExists) {
  //   return res.status(404).json({
  //     isSuccess: false,
  //     message: 'المستخدم غير موجود',
  //     statusCode: 404,
  //     data: null,
  //   });
  // }

  next();
});

// ✅ التحقق من صلاحيات المشرف
exports.restrictToAdmin = catchAsync(async (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({
      isSuccess: false,
      message: 'غير مصرح لك بالوصول إلى هذا المسار',
      statusCode: 403,
      data: null,
    });
  }
  next();
});

// ✅ التحقق من صحة معاملات الاستعلام
exports.validateQueryParams = catchAsync(async (req, res, next) => {
  const { page, limit, status, category } = req.query;

  // التحقق من صحة الصفحة
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'رقم الصفحة يجب أن يكون رقم صحيح موجب',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الحد
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'الحد يجب أن يكون بين 1 و 100',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الحالة
  if (status && !['upcoming', 'past', 'ongoing', 'all'].includes(status)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'الحالة يجب أن تكون: upcoming, past, ongoing, all',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الفئة
  if (category && !Object.values(CategoryType).includes(category)) {
    return res.status(400).json({
      isSuccess: false,
      message: `الفئة يجب أن تكون واحدة من: ${Object.values(CategoryType).join(', ')}`,
      statusCode: 400,
      data: null,
    });
  }

  next();
});

// ✅ التحقق من صحة إحداثيات البحث القريب
exports.validateNearbySearch = catchAsync(async (req, res, next) => {
  const { lat, lng, maxDistance = 10 } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({
      isSuccess: false,
      message: 'يجب تقديم خط العرض وخط الطول',
      statusCode: 400,
      data: null,
    });
  }

  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const distance = parseFloat(maxDistance);

  if (isNaN(latitude) || isNaN(longitude) || isNaN(distance)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'الإحداثيات أو المسافة غير صالحة',
      statusCode: 400,
      data: null,
    });
  }

  if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
    return res.status(400).json({
      isSuccess: false,
      message: 'الإحداثيات خارج النطاق المسموح',
      statusCode: 400,
      data: null,
    });
  }

  if (distance < 0.1 || distance > 100) {
    return res.status(400).json({
      isSuccess: false,
      message: 'المسافة يجب أن تكون بين 0.1 و 100 كيلومتر',
      statusCode: 400,
      data: null,
    });
  }

  next();
});

// ✅ التحقق من صحة معاملات البحث
exports.validateSearchParams = catchAsync(async (req, res, next) => {
  const { q, page, limit } = req.query;

  if (!q || q.trim() === '') {
    return res.status(400).json({
      isSuccess: false,
      message: 'كلمة البحث مطلوبة',
      statusCode: 400,
      data: null,
    });
  }

  if (q.trim().length < 2) {
    return res.status(400).json({
      isSuccess: false,
      message: 'كلمة البحث يجب أن تكون على الأقل حرفين',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الصفحة
  if (page && (isNaN(page) || parseInt(page) < 1)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'رقم الصفحة يجب أن يكون رقم صحيح موجب',
      statusCode: 400,
      data: null,
    });
  }

  // التحقق من صحة الحد
  if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 50)) {
    return res.status(400).json({
      isSuccess: false,
      message: 'الحد يجب أن يكون بين 1 و 50',
      statusCode: 400,
      data: null,
    });
  }

  next();
});

module.exports = exports;