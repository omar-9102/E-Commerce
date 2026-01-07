const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');
const paymentController  = require('./payment.controller')

router.post("/pay", verifyToken, allowTo(userRules.USER), paymentController.createPayment);

module.exports = router;
