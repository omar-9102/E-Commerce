const prisma = require('../../lib/prisma'); 
const bcrypt = require('bcrypt');
const {userRules} = require('../../utils/roles')
const generateToken = require('../../utils/generateToken');
const appError = require('../../utils/AppError')
const httpStatusText = require('../../utils/httpStatusText')

const createProduct = async ({ name, description, price, stock, vendorId, categoryId }) => {
    if(!name || !description || !price || !stock || !vendorId || !categoryId) {
        return appError.create("Missing fields", 400, httpStatusText.ERROR )
    }
    const product = await prisma.product.create({
        data: {
            name,
            description,
            price,
            stock,
            vendorId,
            categoryId
        }
    });
    return product;
}

module.exports = { createProduct };