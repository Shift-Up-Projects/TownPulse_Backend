// documentation/swagger/activities.js
/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - map_url
 *         - latitude
 *         - longitude
 *         - start_date
 *         - end_date
 *         - price
 *         - capacity
 *         - category
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated activity ID
 *         title:
 *           type: string
 *           maxLength: 255
 *           example: "Summer Music Festival"
 *         description:
 *           type: string
 *           example: "Annual summer music festival with local bands"
 *         location:
 *           type: string
 *           example: "Central Park, New York"
 *         map_url:
 *           type: string
 *           format: uri
 *           example: "https://maps.google.com/?q=40.7829,-73.9654"
 *         latitude:
 *           type: number
 *           format: float
 *           minimum: -90
 *           maximum: 90
 *           example: 40.7829
 *         longitude:
 *           type: number
 *           format: float
 *           minimum: -180
 *           maximum: 180
 *           example: -73.9654
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2024-07-15T18:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2024-07-15T23:00:00Z"
 *         status:
 *           type: string
 *           enum: [upcoming, ongoing, completed, cancelled]
 *           default: upcoming
 *         category:
 *           type: string
 *           enum: [sports, cultural, educational, social, business, entertainment]
 *           example: entertainment
 *         price:
 *           type: number
 *           format: decimal
 *           minimum: 0
 *           example: 25.50
 *         capacity:
 *           type: integer
 *           minimum: 1
 *           example: 500
 *         creator:
 *           $ref: '#/components/schemas/User'
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 * 
 *     ActivityResponse:
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
 *           $ref: '#/components/schemas/Activity'
 * 
 *     ActivitiesListResponse:
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
 *             activities:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Activity'
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalActivities:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 * 
 *     CreateActivityRequest:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - location
 *         - map_url
 *         - latitude
 *         - longitude
 *         - start_date
 *         - end_date
 *         - price
 *         - capacity
 *         - category
 *       properties:
 *         title:
 *           type: string
 *           example: "Summer Music Festival"
 *         description:
 *           type: string
 *           example: "Annual summer music festival with local bands"
 *         location:
 *           type: string
 *           example: "Central Park, New York"
 *         map_url:
 *           type: string
 *           example: "https://maps.google.com/?q=40.7829,-73.9654"
 *         latitude:
 *           type: number
 *           example: 40.7829
 *         longitude:
 *           type: number
 *           example: -73.9654
 *         start_date:
 *           type: string
 *           format: date-time
 *           example: "2024-07-15T18:00:00Z"
 *         end_date:
 *           type: string
 *           format: date-time
 *           example: "2024-07-15T23:00:00Z"
 *         price:
 *           type: number
 *           example: 25.50
 *         capacity:
 *           type: integer
 *           example: 500
 *         category:
 *           type: string
 *           enum: [sports, cultural, educational, social, business, entertainment]
 *           example: entertainment
 * 
 *     NearbyActivitiesResponse:
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
 *             activities:
 *               type: array
 *               items:
 *                 allOf:
 *                   - $ref: '#/components/schemas/Activity'
 *                   - type: object
 *                     properties:
 *                       distance:
 *                         type: number
 *                         description: Distance in kilometers
 *                         example: 2.5
 *             pagination:
 *               type: object
 *               properties:
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *                 totalActivities:
 *                   type: integer
 *                 hasNext:
 *                   type: boolean
 *                 hasPrev:
 *                   type: boolean
 *             searchLocation:
 *               type: object
 *               properties:
 *                 latitude:
 *                   type: number
 *                 longitude:
 *                   type: number
 *                 maxDistance:
 *                   type: number
 * 
 *   parameters:
 *     activityIdParam:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: Activity ID
 * 
 *     userIdParam:
 *       in: path
 *       name: userId
 *       required: true
 *       schema:
 *         type: string
 *         pattern: '^[0-9a-fA-F]{24}$'
 *       description: User ID
 * 
 *     nearbySearchParams:
 *       in: query
 *       name: lat
 *       required: true
 *       schema:
 *         type: number
 *         format: float
 *       description: Latitude coordinate
 *     - in: query
 *       name: lng
 *       required: true
 *       schema:
 *         type: number
 *         format: float
 *       description: Longitude coordinate
 *     - in: query
 *       name: maxDistance
 *       schema:
 *         type: number
 *         format: float
 *         default: 10
 *       description: Maximum distance in kilometers
 *     - in: query
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
 *       description: Number of items per page
 */

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Activity management endpoints
 */

/**
 * @swagger
 * /api/v1.0.0/activities:
 *   get:
 *     summary: Get all activities
 *     description: Retrieve paginated list of all activities with filtering options
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of activities per page
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sports, cultural, educational, social, business, entertainment]
 *         description: Filter by category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, past]
 *         description: Filter by activity status
 *     responses:
 *       200:
 *         description: Activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivitiesListResponse'
 *       401:
 *         description: Not authenticated
 * 
 *   post:
 *     summary: Create a new activity
 *     description: Create a new activity (Authentication required)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       201:
 *         description: Activity created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/v1.0.0/activities/{id}:
 *   get:
 *     summary: Get activity by ID
 *     description: Retrieve specific activity details by ID
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/activityIdParam'
 *     responses:
 *       200:
 *         description: Activity retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 *       404:
 *         description: Activity not found
 *       401:
 *         description: Not authenticated
 * 
 *   patch:
 *     summary: Update activity by ID
 *     description: Update activity information (Creator or Admin only)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/activityIdParam'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivityRequest'
 *     responses:
 *       200:
 *         description: Activity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivityResponse'
 *       403:
 *         description: Not authorized to update this activity
 *       404:
 *         description: Activity not found
 * 
 *   delete:
 *     summary: Delete activity by ID
 *     description: Delete activity (Creator or Admin only)
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/activityIdParam'
 *     responses:
 *       204:
 *         description: Activity deleted successfully
 *       403:
 *         description: Not authorized to delete this activity
 *       404:
 *         description: Activity not found
 */

/**
 * @swagger
 * /api/v1.0.0/activities/my/activities:
 *   get:
 *     summary: Get current user's activities
 *     description: Retrieve paginated list of activities created by the authenticated user
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Number of activities per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, past]
 *         description: Filter by activity status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sports, cultural, educational, social, business, entertainment]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: User activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivitiesListResponse'
 *       401:
 *         description: Not authenticated
 */

/**
 * @swagger
 * /api/v1.0.0/activities/user/{userId}/activities:
 *   get:
 *     summary: Get user's activities by user ID
 *     description: Retrieve paginated list of activities created by a specific user (Admin or User access)
 *     tags: [Activities]
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
 *         description: Number of activities per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [upcoming, ongoing, past]
 *         description: Filter by activity status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sports, cultural, educational, social, business, entertainment]
 *         description: Filter by category
 *     responses:
 *       200:
 *         description: User activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ActivitiesListResponse'
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /api/v1.0.0/activities/nearby:
 *   get:
 *     summary: Find nearby activities
 *     description: Discover activities within a specified distance from given coordinates
 *     tags: [Activities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: lat
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Latitude coordinate
 *       - in: query
 *         name: lng
 *         required: true
 *         schema:
 *           type: number
 *           format: float
 *         description: Longitude coordinate
 *       - in: query
 *         name: maxDistance
 *         schema:
 *           type: number
 *           format: float
 *           default: 10
 *         description: Maximum distance in kilometers (default 10km)
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
 *         description: Number of activities per page
 *     responses:
 *       200:
 *         description: Nearby activities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NearbyActivitiesResponse'
 *       400:
 *         description: Invalid coordinates or missing parameters
 *       401:
 *         description: Not authenticated
 */

module.exports = { swaggerActivityDocs: 'Activity API Documentation' };