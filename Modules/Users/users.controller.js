const userServices = require('./users.services')
const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const asyncWrapper = require('express-async-handler')
const vendorDashboardService = require('./users.analytics')

const getUsers = asyncWrapper(async (req, res) => {
    const users = await userServices.getAllUsers();
    return res.status(200).json({data: users, count: users.length}); 
})

const getVendors = asyncWrapper(async(req, res) =>{
    const vendors = await userServices.getAllVendors();
    return res.status(200).json({data: vendors, count: vendors.length});
})

const getUserInfo = asyncWrapper(async(req, res) =>{
    const userId = req.params.id
    const user = await userServices.getUserInfoForAdmin(userId)
    return res.status(200).json({data: user})
})

const registerVendor = asyncWrapper(async(req, res) => {
    const vendor = await userServices.vendorRegistration(req.body, req.file);
    return res.status(201).json({message: "Vendor created successfully",data: vendor});
})

const registerUser = asyncWrapper(async(req, res) =>{
    const user = await userServices.userRegistration(req.body, req.file);
    return res.status(201).json({message: "User created successfully", data: user});
})

const login = asyncWrapper(async(req, res) =>{
    const {email, password} = req.body;
    const user = await userServices.login(email, password)
    return res.status(200).json({message: "Login Successful", data: user});
})

const updateUserProfile = asyncWrapper(async(req, res) =>{
    const userId = req.user.id;
    const user = await userServices.updateProfile(userId, req.body, req.file);
    res.status(200).json({message: "Profile updated successfully", data: user});
})

const deleteMyAccount = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const user = await userServices.deleteMyAccount(userId)
    res.status(200).json({message: "Account deleted succesfully", data:`${user.email} deleted`})
})

const vendorDashboard = asyncWrapper(async(req, res) => {
    const vendorId = req.user.id
    const data = await vendorDashboardService(vendorId)
    return res.status(200).json({data: data})
})


module.exports = { getUsers, getVendors, registerVendor, registerUser, login, updateUserProfile, deleteMyAccount, getUserInfo, vendorDashboard };