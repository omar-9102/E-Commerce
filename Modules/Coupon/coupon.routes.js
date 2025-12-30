const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const couponController = require('./coupon.contoller')
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');


module.exports = router;
