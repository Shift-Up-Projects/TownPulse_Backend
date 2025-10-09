/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Attendance management and tracking
 */

/**
 * @swagger
 * /attendance:
 *   post:
 *     summary: Create attendance record
 *     description: Only admins and users can create attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createAttendance'
 *     responses:
 *       "201":
 *         description: Attendance created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance created successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       "400":
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   get:
 *     summary: Get all attendance records
 *     description: Only admins and users can view all attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/LimitParameter'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ['present', 'absent', 'late', 'excused']
 *         description: Filter by attendance status
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance records fetched successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Attendance'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get specific attendance record
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParameter'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance record fetched successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update attendance record
 *     description: Only attendance owner or admin can update
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParameter'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateAttendance'
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Attendance updated successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Attendance'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete attendance record
 *     description: Only attendance owner or admin can delete
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParameter'
 *     responses:
 *       "204":
 *         description: No Content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /attendance/my/attendance:
 *   get:
 *     summary: Get current user's attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/LimitParameter'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ['present', 'absent', 'late', 'excused']
 *         description: Filter by attendance status
 *       - name: activity_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by specific activity
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "5 attendance records fetched from your history"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendance:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attendance'
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 3
 *                         totalRecords:
 *                           type: integer
 *                           example: 25
 *                         hasNext:
 *                           type: boolean
 *                           example: true
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *                         limit:
 *                           type: integer
 *                           example: 10
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /attendance/activity/{activityId}/attendance:
 *   get:
 *     summary: Get attendance records for specific activity
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: activityId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Activity ID
 *       - $ref: '#/components/parameters/PageParameter'
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 50
 *           maximum: 100
 *         description: Items per page (max 100)
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ['present', 'absent', 'late', 'excused']
 *         description: Filter by attendance status
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "15 attendance records fetched for this activity"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendance:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attendance'
 *                     activityInfo:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439012"
 *                         title:
 *                           type: string
 *                           example: "Local Culture Festival"
 *                         start_date:
 *                           type: string
 *                           format: date-time
 *                         location:
 *                           type: string
 *                           example: "Riyadh, Saudi Arabia"
 *                         capacity:
 *                           type: integer
 *                           example: 100
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         total_attendance:
 *                           type: integer
 *                           example: 15
 *                         attendance_rate:
 *                           type: string
 *                           example: "15.00"
 *                         status_breakdown:
 *                           type: object
 *                           properties:
 *                             present:
 *                               type: integer
 *                               example: 12
 *                             absent:
 *                               type: integer
 *                               example: 2
 *                             late:
 *                               type: integer
 *                               example: 1
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         totalRecords:
 *                           type: integer
 *                           example: 15
 *                         hasNext:
 *                           type: boolean
 *                           example: false
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *                         limit:
 *                           type: integer
 *                           example: 50
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /attendance/user/{userId}/attendance:
 *   get:
 *     summary: Get attendance records for specific user
 *     description: Admin or user can view other users' attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/LimitParameter'
 *       - name: status
 *         in: query
 *         schema:
 *           type: string
 *           enum: ['present', 'absent', 'late', 'excused']
 *         description: Filter by attendance status
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isSuccess:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "8 attendance records fetched for user"
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   properties:
 *                     attendance:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Attendance'
 *                     userInfo:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: "507f1f77bcf86cd799439011"
 *                         name:
 *                           type: string
 *                           example: "Ahmed Mohamed"
 *                         email:
 *                           type: string
 *                           example: "ahmed@example.com"
 *                     pagination:
 *                       type: object
 *                       properties:
 *                         currentPage:
 *                           type: integer
 *                           example: 1
 *                         totalPages:
 *                           type: integer
 *                           example: 1
 *                         totalRecords:
 *                           type: integer
 *                           example: 8
 *                         hasNext:
 *                           type: boolean
 *                           example: false
 *                         hasPrev:
 *                           type: boolean
 *                           example: false
 *                         limit:
 *                           type: integer
 *                           example: 10
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */