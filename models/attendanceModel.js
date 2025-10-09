const mongoose = require('mongoose');
const { AttendanceStatus } = require('../utils/enum');

const attendanceSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: Object.values(AttendanceStatus),
      required: [true, 'Attendance status is required'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// لمنع التسجيلات المكررة لنفس المستخدم والنشاط
attendanceSchema.index({ user_id: 1, activity_id: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;
