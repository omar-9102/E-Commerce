// services/userService.js
const prisma = require('../../lib/prisma'); 
const bcrypt = require('bcrypt');
const {userRules} = require('../../utils/roles')
const generateToken = require('../../utils/generateToken');
const appError = require('../../utils/AppError')
const httpStatusText = require('../../utils/httpStatusText')
const cloudinary = require('../../config/cloudinary')



const getAllUsers = async () => {
  // Uses findMany to fetch all records
    return await prisma.user.findMany({where: {role: userRules.USER}, omit:{password: true}})
};

const getAllVendors = async () => {
  // Uses findMany to fetch all records
    return await prisma.user.findMany({where: {role: userRules.VENDOR}, omit:{password: true}})
};

const getUserInfoForAdmin = async(userId) =>{
    const user = await prisma.user.findUnique({where:{id: userId}, omit:{password: true}})
    if(!user)
        throw appError.create("User not found")
    return user
}

const register = async (data, file) => {
    const { firstName, lastName, username, email, password, address, phone, role } = data
    if(!firstName || !lastName || !username || !email || !password || !address)
        throw appError.create("Missing required fields", 400, httpStatusText.FAIL)

    const oldEmail = await prisma.user.findUnique({ where: { email } });
    if (oldEmail) 
        throw appError.create("Email exists", 409, httpStatusText.FAIL);

    const oldUsername = await prisma.user.findUnique({ where: { username } });
    if (oldUsername)
        throw appError.create("username exists", 409, httpStatusText.FAIL);

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            firstName,
            lastName,
            email,
            username,
            address,
            phone,
            role,
            password: hashedPassword,
            avatarUrl: file ? file.path : null,
            publicId: file ? file.filename: null
        }
    });

    const token = generateToken({id: user.id, role: user.role});
    return {user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl
    }, token };
};

const vendorRegistration = async (data, file) => {
    return register({ ...data, role: userRules.VENDOR }, file);
};

const userRegistration = async (data, file) => {
    const { user, token } = await register({ ...data, role: userRules.USER }, file);

    await prisma.cart.create({
        data: { userId: user.id }
    });

    return { user, token };
};


const updateProfile = async (id, data = {}, file) => {
    const allowedUpdates = ['firstName', 'lastName', 'username', 'address'];
    const updates = Object.keys(data);
    if (updates.length === 0 && !file) 
        throw appError.create("No fields to update", 400, httpStatusText.ERROR);

    const isValid = updates.every(update => allowedUpdates.includes(update));
    if (!isValid) 
        throw appError.create("Invalid updates", 400, httpStatusText.ERROR);

  // Username uniqueness check
    if (data.username) {
        const existingUsername = await prisma.user.findUnique({where: { username: data.username },select: { id: true }});

        if (existingUsername && existingUsername.id !== id) {
            throw appError.create("Username already taken", 409, httpStatusText.ERROR);}
    }

    // Fetch current user (needed for avatar deletion)
    const existingUser = await prisma.user.findUnique({where: { id },select: { publicId: true }});

    // Avatar replacement logic
    if (file && existingUser?.publicId) {
        await cloudinary.uploader.destroy(existingUser.publicId);
    }

    const updateData = {...data}
    if(file){
        updateData.avatarUrl = file.path
        updateData.publicId = file.filename
    }

    const user = await prisma.user.update({
        where: { id },
        data: updateData,
        select: {
            firstName: true,
            lastName: true,
            username: true,
            avatarUrl: true
        }
});

    return {
        ...user,
        Welcome_Message: `Hi! ${user.firstName} ${user.lastName}`
    };
};


const login = async(email, password) =>{
    const user = await prisma.user.findUnique({where: {email}});
    if(!user){
        throw new Error("Please register first")
    }
    const passwordDecryption = await bcrypt.compare(password, user.password);
    if(!passwordDecryption){
        throw new Error("Invalid Email or Password")
    }
    const token = generateToken({id: user.id, role: user.role});
    return {user: {
        id: user.id,
        Welcome_Message: `Hi! ${user.firstName} ${user.lastName}`,
        username: user.username,
        avatarUrl: user.avatarUrl
    }, token };
}

const deleteMyAccount = async(userId) =>{
    const delUser = await prisma.user.findUnique({where:{id:userId}, select:{id:true}})
    if(!delUser)
        throw appError.create("User not found", 404, httpStatusText.ERROR)
    // if user have products 
    const userWithProducts = await prisma.product.count({where:{vendorId: userId}})
    if(userWithProducts)
        throw appError.create("Cannot delete accont which offer products !", 400, httpStatusText.FAIL)

    await prisma.user.delete({where:{id: userId}})
    return
}


module.exports = { getAllUsers,getAllVendors, vendorRegistration, userRegistration, login, updateProfile, deleteMyAccount, getUserInfoForAdmin};
