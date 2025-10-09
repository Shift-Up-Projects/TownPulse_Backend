/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Review management and retrieval
 */

/**
 * @swagger
 * /reviews:
 *   post:
 *     summary: Create a new review
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createReview'
 *     responses:
 *       "201":
 *         description: Review created successfully
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
 *                   example: success, Review created successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 201
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       "400":
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: You have already reviewed this activity
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         description: Activity not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   get:
 *     summary: Get all reviews
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/PageParameter'
 *       - $ref: '#/components/parameters/LimitParameter'
 *       - name: activity_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by activity ID
 *       - name: user_id
 *         in: query
 *         schema:
 *           type: string
 *         description: Filter by user ID
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
 *                   example: Success, number of documents 5
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /reviews/{id}:
 *   get:
 *     summary: Get a specific review
 *     tags: [Reviews]
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
 *                   example: success, Review retrieved successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a review
 *     description: Only review owner can update
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - $ref: '#/components/parameters/IdParameter'
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateReview'
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
 *                   example: success, Review updated successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   $ref: '#/components/schemas/Review'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: Not authorized to update this review
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a review
 *     description: Only review owner or admin can delete
 *     tags: [Reviews]
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
 *                   example: success, Review deleted successfully
 *                 statusCode:
 *                   type: integer
 *                   example: 200
 *                 data:
 *                   type: object
 *                   example: null
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         description: Forbidden
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               status: error
 *               message: Not authorized to delete this review
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */