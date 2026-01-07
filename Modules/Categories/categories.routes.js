const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const categoriesController = require('./categories.controller')
const categoriesValidators = require('./categories.validators')

router.post('/createCategory', validate(categoriesValidators.createValidCategory), categoriesController.createCategory);
// router.get('/getCategoriesTree', categoriesController.getCategoryTree);
router.get('/getCategoriesTreeWithProducts', categoriesController.getCategoriesTreeWithProducts);
router.get('/getCategoriesTree', categoriesController.getCategoriesTree);
router.patch('/updateCategory/:id', categoriesController.updateCategory);
router.delete('/deleteCategory/:id', categoriesController.deleteCategory);

module.exports = router;
