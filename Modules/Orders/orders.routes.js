const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const ordersController = require('./orders.controller')
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');


router.post('/checkOut', verifyToken, allowTo(userRules.USER), ordersController.orderNow);
router.get('/viewAllOrders', verifyToken, allowTo(userRules.USER), ordersController.viewAllOrders)
router.get('/viewSingleOrder/:orderId', verifyToken, allowTo(userRules.USER), ordersController.viewSingleOrder)


module.exports = router;
