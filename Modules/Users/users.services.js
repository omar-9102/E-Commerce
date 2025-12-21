// services/userService.js
const prisma = require('../../lib/prisma'); 
const bcrypt = require('bcrypt');
const {userRules} = require('../../utils/roles')

const register = async ({ firstName, lastName, username, email, password, address, role }) => {
    const oldEmail = await prisma.user.findUnique({ where: { email } });
    if (oldEmail) {
        throw new Error("EMAIL_EXISTS");
    }

    const oldUsername = await prisma.user.findUnique({ where: { username } });
    if (oldUsername) {
        throw new Error("USERNAME_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            firstName,
            lastName,
            username,
            email,
            password: hashedPassword,
            address,
            role
        }
    });
};

const getAllUsers = async () => {
  // Uses findMany to fetch all records
    return await prisma.user.findMany({where: {role: userRules.USER}})
};

const getAllVendors = async () => {
  // Uses findMany to fetch all records
    return await prisma.user.findMany({where: {role: userRules.VENDOR}})
};

const vendorRegistration = async (data) => {
    return register({ ...data, role: userRules.VENDOR });
};

const userRegistration = async (data) => {
    return register({ ...data, role: userRules.USER });
}

const login = async(email, password) =>{
    const user = await prisma.user.findUnique({where: {email}});
    if(!user){
      throw new Error("Please register first")
    }
    const passwordDecryption = await bcrypt.compare(password, user.password);
    if(!passwordDecryption){
      throw new Error("Invalid Email or Password")
    }
    return user;
  }


module.exports = { getAllUsers,getAllVendors, vendorRegistration, userRegistration, login};
