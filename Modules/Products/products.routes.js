const express = require('express')
const router = express.Router();
const productsController = require('./products.controller')
const { verifyToken } = require('../../middlewares/verifyToken');
const allowTo = require('../../utils/allowTo')
const {userRules} = require('../../utils/roles')
const upload = require('../../config/multer.config')

router.post('/createProduct', verifyToken, allowTo(userRules.VENDOR),upload.array('images', 5), productsController.createProduct);
router.get('/getAllProductsPaginated', productsController.getAllProductsPaginated);
router.patch('/updateProduct/:id', verifyToken, allowTo(userRules.VENDOR), productsController.updateProduct);
router.delete('/deleteProduct/:id', verifyToken, allowTo(userRules.VENDOR), productsController.deleteProduct);
router.get('/getVendorProducts', verifyToken, allowTo(userRules.VENDOR), productsController.getVendorProducts);
router.post('/:productId/review', verifyToken, allowTo(userRules.USER), productsController.review)
router.get('/showMyReviews', verifyToken, allowTo(userRules.USER),productsController.getMyReviews )

module.exports = router;