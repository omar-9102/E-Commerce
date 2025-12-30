const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const paymentController = require('./payment.contoller')
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');


module.exports = router;
