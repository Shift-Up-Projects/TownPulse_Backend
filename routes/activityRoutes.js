const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');
const authMiddlewers = require('../middlewares/authMiddlewers');
const activityMiddleware = require('../middlewares/activityMiddleware');


router.use(authMiddlewers.protect);

router.get(
  '/my/activities',
  activityMiddleware.validateQueryParams,
  activityController.getMyActivities
);

router.get(
  '/user/:userId/activities',
  authMiddlewers.restrictTo('ADMIN'),
  activityMiddleware.validateUserId,
  activityMiddleware.validateQueryParams,
  activityController.getUserActivities
);
router.get(
  '/nearby',
  activityMiddleware.validateNearbySearch,
  activityController.getNearbyActivities
);
router.get(
  '/',
  activityMiddleware.validateQueryParams,
  activityController.getAllActivities
);
router.get('/:id', activityController.getActivity);
router.post(
  '/',
  activityMiddleware.validateCreateActivity,
  activityController.createActivity
);

router.delete(
  '/:id', 
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  activityMiddleware.checkActivityOwner,
  activityController.deleteActivity
);

router.patch(
  '/:id', 
  authMiddlewers.restrictTo('ADMIN', 'USER'),
  activityMiddleware.checkActivityOwner,
  activityController.updateActivity
);

module.exports = router;