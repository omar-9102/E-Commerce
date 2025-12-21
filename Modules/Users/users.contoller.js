const userServices = require('./users.services')

const getUsers = async (req, res) => {
    try {
        const users = await userServices.getAllUsers();
        // You must send the response back
        return res.status(200).json({data: users, count: users.length}); 
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
const getVendors = async(req, res) =>{
    try{
        const vendors = await userServices.getAllVendors();
        return res.status(200).json({data: vendors, count: vendors.length});
    }catch(error){
        return res.status(s=500).json({error: error.message})
    }
}

const registerVendor = async (req, res, next) => {
    try {
        const vendor = await userServices.vendorRegistration(req.body);
        return res.status(201).json({message: "Vendor created successfully",data: vendor});
    } catch (error) {
        if (error.message === "EMAIL_EXISTS") {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        if (error.message === "USERNAME_EXISTS") {
            return res.status(400).json({ message: "User with this username already exists" });
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
            return res.status(400).json({message: "User with this email already exists"});
        }
        if(error.message === "USERNAME_EXISTS"){
            return res.status(400).json({message: "User with this username already exists"});
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
            return res.status(400).json({message: "Please register first"});
        }
        if(error.message === "Invalid Email or Password"){
            return res.status(400).json({message: "Invalid Email or Password"});
        }
    }
}


module.exports = { getUsers, getVendors, registerVendor, registerUser, login };