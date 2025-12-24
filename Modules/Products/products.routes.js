const express = require('express')
const router = express.Router();
const productsController = require('./products.controller')
const { verifyToken } = require('../../middlewares/verifyToken');
const allowTo = require('../../utils/allowTo')
const {userRules} = require('../../utils/roles')

router.post('/createProduct', verifyToken, allowTo(userRules.VENDOR), productsController.createProduct);

module.exports = router;