// documentation/swagger/attendance.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Attendance:
 *       type: object
 *       required:
 *         - user_id
 *         - activity_id
 *         - status
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated attendance ID
 *         user_id:
 *           $ref: '#/components/schemas/User'
 *         activity_id:
 *           $ref: '#/components/schemas/Activity'
 *         status:
 *           type: string
 *           enum: [present, absent, late, excused]
 *           example: present
 *         attended_at:
 *           type: string
 *           format: date-time
 *           description: Actual attendance timestamp
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     AttendanceResponse:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         data:
 *           $ref: '#/components/schemas/Attendance'
 * 
 *     AttendanceListResponse:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         data:
 *           type: object
 *           properties:
 *             attendance:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *                 limit:
 *                   type: integer
 * 
 *     CreateAttendanceRequest:
 *       type: object
 *       required:
 *         - user_id
 *         - activity_id
 *       properties:
 *         user_id:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "507f1f77bcf86cd799439012"
 *         activity_id:
 *           type: string
 *           pattern: '^[0-9a-fA-F]{24}$'
 *           example: "507f1f77bcf86cd799439011"
 *         status:
 *           type: string
 *           enum: [present, absent, late, excused]
 *           default: present
 *         attended_at:
 *           type: string
 *           format: date-time
 *           example: "2024-01-15T10:30:00Z"
 * 
 *     ActivityAttendanceResponse:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         data:
 *           type: object
 *           properties:
 *             attendance:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *             activityInfo:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 start_date:
 *                   type: string
 *                   format: date-time
 *                 location:
 *                   type: string
 *                 capacity:
 *                   type: integer
 *             statistics:
 *               type: object
 *               properties:
 *                 total_attendance:
 *                   type: integer
 *                 attendance_rate:
 *                   type: number
 *                   format: float
 *                 status_breakdown:
 *                   type: object
 *                   additionalProperties:
 *                     type: integer
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *                 limit:
 *                   type: integer
 * 
 *     UserAttendanceResponse:
 *       type: object
 *       properties:
 *         isSuccess:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         statusCode:
 *           type: integer
 *         data:
 *           type: object
 *           properties:
 *             attendance:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Attendance'
 *             userInfo:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalRecords:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *                 limit:
 *                   type: integer
 * 
 *   parameters:
 *     attendanceIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: Attendance record ID
 * 
 *     activityIdParam:
 *       in: path
 *       name: activityId
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: Activity ID for attendance records
 * 
 *     userIdParam:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: User ID for attendance records
 * 
 *     attendanceQueryParams:
 *       in: query
 *       name: page
 *       schema:
 *         type: integer
 *         default: 1
 *       description: Page number
 *     - in: query
 *       name: limit
 *       schema:
 *         type: integer
 *         default: 10
 *       description: Number of items per page (max 100)
 *     - in: query
 *       name: status
 *       schema:
 *         type: string
 *         enum: [present, absent, late, excused]
 *       description: Filter by attendance status
 *     - in: query
 *       name: activity_id
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: Filter by activity ID
 */

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management and tracking endpoints
 */

/**
 * @swagger
 * /api/v1.0.0/attendance:
 *   get:
 *     summary: Get all attendance records (Admin/User access)
 *     description: Retrieve paginated list of all attendance records with filtering options
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceQueryParams'
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceListResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied
 * 
 *   post:
 *     summary: Create new attendance record
 *     description: Register attendance for a user in an activity (Prevents duplicates)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateAttendanceRequest'
 *     responses:
 *       201:
 *         description: Attendance recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceResponse'
 *       400:
 *         description: Invalid input or duplicate attendance
 *       404:
 *         description: User or activity not found
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/v1.0.0/attendance/{id}:
 *   get:
 *     summary: Get attendance record by ID
 *     description: Retrieve specific attendance record details
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceResponse'
 *       404:
 *         description: Attendance record not found
 *       401:
 *         description: Not authenticated
 * 
 *   patch:
 *     summary: Update attendance record
 *     description: Update attendance status or timestamp (Record owner or Admin only)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [present, absent, late, excused]
 *               attended_at:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Attendance record updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceResponse'
 *       403:
 *         description: Not authorized to update this record
 *       404:
 *         description: Attendance record not found
 * 
 *   delete:
 *     summary: Delete attendance record
 *     description: Remove attendance record (Record owner or Admin only)
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceIdParam'
 *     responses:
 *       200:
 *         description: Attendance record deleted successfully
 *       403:
 *         description: Not authorized to delete this record
 *       404:
 *         description: Attendance record not found
 */

/**
 * @swagger
 * /api/v1.0.0/attendance/my/attendance:
 *   get:
 *     summary: Get current user's attendance history
 *     description: Retrieve paginated attendance records for the authenticated user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/attendanceQueryParams'
 *     responses:
 *       200:
 *         description: User attendance history retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceListResponse'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/v1.0.0/attendance/activity/{activityId}/attendance:
 *   get:
 *     summary: Get attendance records for specific activity
 *     description: Retrieve paginated attendance records for a specific activity with statistics
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/activityIdParam'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent, late, excused]
 *         description: Filter by attendance status
 *     responses:
 *       200:
 *         description: Activity attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityAttendanceResponse'
 *       404:
 *         description: Activity not found
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/v1.0.0/attendance/user/{userId}/attendance:
 *   get:
 *     summary: Get attendance records for specific user (Admin/User access)
 *     description: Retrieve paginated attendance records for a specific user
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/userIdParam'
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page (max 100)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [present, absent, late, excused]
 *         description: Filter by attendance status
 *     responses:
 *       200:
 *         description: User attendance records retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserAttendanceResponse'
 *       404:
 *         description: User not found
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Access denied
 */

module.exports = { swaggerAttendanceDocs: 'Attendance API Documentation' };