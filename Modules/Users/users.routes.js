// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./users.contoller');
const userValidators = require('./users.validators')
const validate = require('../../middlewares/validate');

router.get('/getUsers', userController.getUsers);
router.get('/getVendors', userController.getVendors);
router.post('/registerVendor', validate(userValidators.registerUserSchema), userController.registerVendor);
router.post('/registerUser', validate(userValidators.registerUserSchema), userController.registerUser);
router.post('/login', validate(userValidators.loginUserSchema), userController.login)
module.exports = router;
