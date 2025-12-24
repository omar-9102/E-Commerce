const express = require('express')
const router = express.Router();
const productsController = require('./products.controller')

router.post('/createProduct', productsController.createProduct);

module.exports = router;