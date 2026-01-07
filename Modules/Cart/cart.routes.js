const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const {verifyToken} = require('../../middlewares/verifyToken');
const cartController = require('./cart.controller')
const {userRules} = require('../../utils/roles')
const allowTo = require('../../utils/allowTo');

router.post('/addToCart', verifyToken, allowTo(userRules.USER), cartController.addToCart )
router.patch('/updateCart', verifyToken, allowTo(userRules.USER), cartController.updateCart )
router.get('/getMyCart', verifyToken, allowTo(userRules.USER), cartController.getMyCart )
router.delete('/emptyCart', verifyToken, allowTo(userRules.USER), cartController.emptyCart)

module.exports = router;
