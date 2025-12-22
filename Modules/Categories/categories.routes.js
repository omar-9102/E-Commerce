const express = require('express');
const router = express.Router();
// const validate = require('../../middlewares/validate');
const categoriesController = require('./categories.contoller')

router.post('/createCategory', categoriesController.createCategory);
router.get('/getCategoriesTree', categoriesController.getCategoryTree);

module.exports = router;
