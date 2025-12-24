const express = require('express');
const router = express.Router();
const validate = require('../../middlewares/validate');
const categoriesController = require('./categories.contoller')
const categoriesValidators = require('./categories.validators')

router.post('/createCategory', validate(categoriesValidators.createValidCategory), categoriesController.createCategory);
router.get('/getCategoriesTree', categoriesController.getCategoryTree);

module.exports = router;
