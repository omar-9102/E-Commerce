// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./users.contoller');
const userValidators = require('./users.validators')
const validate = require('../../middlewares/validate');
const { verifyToken } = require('../../middlewares/verifyToken');
const allowTo = require('../../utils/allowTo')
const {userRules} = require('../../utils/roles')


router.get('/getUsers', verifyToken, allowTo(userRules.ADMIN), userController.getUsers);
router.get('/getVendors', verifyToken, allowTo(userRules.ADMIN), userController.getVendors);
router.post('/registerVendor', verifyToken, allowTo(userRules.ADMIN), validate(userValidators.registerUserSchema), userController.registerVendor);
router.post('/registerUser', validate(userValidators.registerUserSchema), userController.registerUser);
router.post('/login', validate(userValidators.loginUserSchema), userController.login)
module.exports = router;
