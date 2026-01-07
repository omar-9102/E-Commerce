const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const couponController = require('./coupon.controller')
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');

router.post('/createCoupon', verifyToken, allowTo(userRules.VENDOR), couponController.createCoupon)
router.get('/getMyCoupons', verifyToken, allowTo(userRules.VENDOR), couponController.getMyCoupons)


module.exports = router;
