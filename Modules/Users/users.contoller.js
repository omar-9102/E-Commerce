const userServices = require('./users.services')
const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');

const getUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        // You must send the response back
        return res.status(200).json({data: users, count: users.length}); 
    } catch (error) {
        return next(appError.create("Failed to fetch users", 500, httpStatusText.ERROR) );
    }
}
const getVendors = async(req, res, next) =>{
    try{
        const vendors = await userServices.getAllVendors();
        return res.status(200).json({data: vendors, count: vendors.length});
    }catch(error){
        return next(appError.create("Failed to fetch vendors", 500, httpStatusText.ERROR) );
    }
}

const registerVendor = async (req, res, next) => {
    try {
        const vendor = await userServices.vendorRegistration(req.body, req.file);
        return res.status(201).json({message: "Vendor created successfully",data: vendor});
    }catch(error){
        return next(error);
    }
};

const registerUser = async (req, res, next) =>{
    try{
        const user = await userServices.userRegistration(req.body, req.file);
        return res.status(201).json({message: "User created successfully", data: user});
    }catch(error){
        return next(error);
    }
}

const login = async (req, res, next) =>{
    try{
        const {email, password} = req.body;
        const user = await userServices.login(email, password);
        return res.status(200).json({message: "Login Successful", data: user});
    }catch(error){
        if(error.message === "Please register first"){
            return next(appError.create("Please register first", 500, httpStatusText.ERROR) );
        }
        if(error.message === "Invalid Email or Password"){
            return next(appError.create("Invalid Email or Password", 500, httpStatusText.ERROR) );
        }
    }
}

const updateUserProfile = async(req, res, next) =>{
    try{
        const userId = req.user.id;
        console.log('userId', userId);
        const user = await userServices.updateProfile(userId, req.body, req.file);
        res.status(200).json({message: "Profile updated successfully", data: user});
    }catch(error){
        next(appError.create(error.message, error.statusCode || 500, httpStatusText.ERROR) );
    }
}

const deleteMyAccount = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const user = await userServices.deleteMyAccount(userId)
        res.status(200).json({message: "Account deleted succesfully", message:'Account deleted'})
    }catch(error){
        return next(error)
    }
}


module.exports = { getUsers, getVendors, registerVendor, registerUser, login, updateUserProfile, deleteMyAccount };