// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./users.controller');
const userValidators = require('./users.validators')
const validate = require('../../middlewares/validate');
const { verifyToken } = require('../../middlewares/verifyToken');
const allowTo = require('../../utils/allowTo')
const {userRules} = require('../../utils/roles')
const upload = require('../../config/multer.config')


router.get('/getUsers', verifyToken, allowTo(userRules.ADMIN), userController.getUsers);
router.get('/getVendors', verifyToken, allowTo(userRules.ADMIN), userController.getVendors);
router.get('/getInfo/:id', verifyToken, allowTo(userRules.ADMIN), userController.getUserInfo);
router.post('/registerVendor', verifyToken, allowTo(userRules.ADMIN), validate(userValidators.registerUserSchema), upload.single('avatarUrl'), userController.registerVendor);
router.post('/registerUser', upload.single('avatarUrl'), validate(userValidators.registerUserSchema), userController.registerUser);
router.post('/login', validate(userValidators.loginUserSchema), userController.login)
router.patch('/updateProfile', verifyToken, allowTo(userRules.USER, userRules.VENDOR), upload.single('avatarUrl'), userController.updateUserProfile);
router.delete('/deleteAccount', verifyToken, allowTo(userRules.USER, userRules.VENDOR), userController.deleteMyAccount)
router.get('/vendorDashboard', verifyToken, allowTo(userRules.VENDOR), userController.vendorDashboard);

module.exports = router;
