const prisma = require('../../lib/prisma'); 
const bcrypt = require('bcrypt');
const {userRules} = require('../../utils/roles')
const generateToken = require('../../utils/generateToken');
const appError = require('../../utils/AppError')
const httpStatusText = require('../../utils/httpStatusText')

const createProduct = async ({ name, description, price, stock, vendorId, categoryId }) => {
    if(!name || !description || !price || !stock || !vendorId || !categoryId) {
        throw appError.create("Missing required fields", 400, httpStatusText.ERROR);
    }

    if(price < 0)
        throw appError.create("Stock cannot be negative", 400, httpStatusText.ERROR);

    if (!Number.isInteger(stock) || stock < 0) 
        throw appError.create("Invalid stock value", 400, httpStatusText.ERROR);

    const vendor = await prisma.user.findUnique({where: {id: vendorId}})
    if(!vendor)
        throw appError.create("Vendor not found", 404, httpStatusText.FAIL);

    const category = await prisma.category.findUnique({where: {id: categoryId}})
    if(!category)
        throw appError.create("Category not found", 404, httpStatusText.FAIL);

    
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