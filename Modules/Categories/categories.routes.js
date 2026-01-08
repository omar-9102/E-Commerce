const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const categoriesController = require('./categories.controller')
const categoriesValidators = require('./categories.validators')
const allowTo = require('../../utils/allowTo');
const {verifyToken} = require('../../middlewares/verifyToken');
const {userRules} = require('../../utils/roles')


router.post('/createCategory', verifyToken, allowTo(userRules.ADMIN), validate(categoriesValidators.createValidCategory), categoriesController.createCategory);
// router.get('/getCategoriesTree', categoriesController.getCategoryTree);
router.get('/getCategoriesTreeWithProducts', verifyToken, allowTo(userRules.USER, userRules.VENDOR, userRules.ADMIN, userRules.SUPERADMIN), categoriesController.getCategoriesTreeWithProducts);
router.get('/getCategoriesTree', verifyToken, allowTo(userRules.USER, userRules.VENDOR, userRules.ADMIN, userRules.SUPERADMIN), categoriesController.getCategoriesTree);
router.patch('/updateCategory/:id', verifyToken, allowTo(userRules.ADMIN), categoriesController.updateCategory);
router.delete('/deleteCategory/:id', verifyToken, allowTo(userRules.ADMIN), categoriesController.deleteCategory);

module.exports = router;
