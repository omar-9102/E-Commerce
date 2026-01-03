const express = require('express')
const router = express.Router();
const reviewsController = require('./reviews.controller')
const { verifyToken } = require('../../middlewares/verifyToken');
const allowTo = require('../../utils/allowTo')
const {userRules} = require('../../utils/roles')

router.delete('/deleteReview/:id', verifyToken, allowTo(userRules.USER), reviewsController.deleteReview)

module.exports = router;