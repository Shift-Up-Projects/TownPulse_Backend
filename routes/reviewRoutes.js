const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddlewers = require('../middlewares/authMiddlewers');
const reviewMiddleware = require('../middlewares/reviewMiddleware');
router.use(authMiddlewers.protect);

router.post(
  '/',
  reviewMiddleware.validateCreateReview,
  reviewController.createReview,
);
router.get(
  '/',
  reviewMiddleware.validateQueryParams,
  reviewController.getAllReviews,
);
router.get(
  '/:id',
  reviewMiddleware.validateReviewId,
  reviewController.getOneReview,
);
router.patch(
  '/:id',
  reviewMiddleware.validateReviewId,
  reviewMiddleware.checkReviewOwner,
  reviewMiddleware.validateUpdateReview,
  reviewController.updateReview,
);
router.delete(
  '/:id',
  reviewMiddleware.validateReviewId,
  reviewMiddleware.checkReviewOwner,
  reviewController.deleteReview,
);

module.exports = router;
