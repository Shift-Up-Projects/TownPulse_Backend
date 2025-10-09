const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendedController');
const authMiddlewers = require('../middlewares/authMiddlewers');
const attendanceMiddleware = require('../middlewares/attendanceMiddleware');

router.use(authMiddlewers.protect);

router.get(
  '/my/attendance',
  attendanceMiddleware.validateQueryParams,
  attendanceController.getMyAttendance,
);
router.get(
  '/activity/:activityId/attendance',
  attendanceMiddleware.validateActivityId,
  attendanceMiddleware.validateQueryParams,
  attendanceController.getActivityAttendance,
);

router.get(
  '/user/:userId/attendance',
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  attendanceMiddleware.validateUserId,
  attendanceMiddleware.validateQueryParams,
  attendanceController.getUserAttendance,
);

router.get(
  '/',
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  attendanceMiddleware.validateQueryParams,
  attendanceController.getAllAttendance,
);

router.get('/:id', attendanceController.getAttendance);

router.post(
  '/',
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  attendanceMiddleware.validateCreateAttendance,
  attendanceController.createAttendance,
);

router.delete(
  '/:id',
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  attendanceMiddleware.checkAttendanceOwner,
  attendanceController.deleteAttendance,
);

router.patch(
  '/:id',
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  attendanceMiddleware.checkAttendanceOwner,
  attendanceController.updateAttendance,
);

module.exports = router;
