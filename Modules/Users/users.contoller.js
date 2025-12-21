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
        const vendor = await userServices.vendorRegistration(req.body);
        return res.status(201).json({message: "Vendor created successfully",data: vendor});
    } catch (error) {
        if (error.message === "EMAIL_EXISTS") {
            return next(appError.create("Email already exists", 500, httpStatusText.ERROR) );
        }
        if (error.message === "USERNAME_EXISTS") {
            return next(appError.create("Username already exists", 500, httpStatusText.ERROR) );
        }
        next(error);
    }
};

const registerUser = async (req, res, next) =>{
    try{
        const user = await userServices.userRegistration(req.body);
        return res.status(201).json({message: "User created successfully", data: user});
    }catch(error){
        if(error.message === "EMAIL_EXISTS"){
            return next(appError.create("Email already exists", 500, httpStatusText.ERROR) );
        }
        if(error.message === "USERNAME_EXISTS"){
            return next(appError.create("Username already exists", 500, httpStatusText.ERROR) );
        }
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


module.exports = { getUsers, getVendors, registerVendor, registerUser, login };