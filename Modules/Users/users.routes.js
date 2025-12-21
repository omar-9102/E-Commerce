// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userController = require('./users.contoller');

router.get('/getUsers', userController.getUsers);
router.get('/getVendors', userController.getVendors);
router.post('/registerVendor', userController.registerVendor);
router.post('/registerUser', userController.registerUser);
router.post('/login', userController.login)
module.exports = router;
