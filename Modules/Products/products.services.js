const prisma = require('../../lib/prisma'); 
const bcrypt = require('bcrypt');
const {userRules} = require('../../utils/roles')
const generateToken = require('../../utils/generateToken');
const appError = require('../../utils/AppError')
const httpStatusText = require('../../utils/httpStatusText')
const cloudinary = require('../../config/cloudinary')

const getAllProductsPaginated = async(page = 1, limit = 10) =>{
    const offset = (page - 1) * limit;
    const products = await prisma.product.findMany({
        skip: offset,
        take: limit,
    });
    return products;
}

const createProduct = async (data, files) => {
    const { name, description, price, stock, vendorId, categoryId } = data
    // Parse numeric fields
    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if(!name  || !description || !price || !stock || !vendorId || !categoryId) {
        throw appError.create("Missing required fields", 400, httpStatusText.ERROR);
    }

    if (!Number.isInteger(parsedStock) || parsedStock < 0) {
        throw appError.create("Invalid stock value", 400);
    }

    if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
        throw appError.create("Invalid price value", 400);
    }
    
    const vendor = await prisma.user.findUnique({where: {id: vendorId}})
    if(!vendor)
        throw appError.create("Vendor not found", 404, httpStatusText.FAIL);

    const category = await prisma.category.findUnique({where: {id: categoryId}})
    if(!category)
        throw appError.create("Category not found", 404, httpStatusText.FAIL);

    const uploadedImages = []
    for(const file of files){
        const result = await cloudinary.uploader.upload(file.path, {folder: 'products'})
        uploadedImages.push({url: result.secure_url, publicId:result.public_id})
    }

    // 4️⃣ Transaction: product + images
    const product = await prisma.$transaction(async (tx) => {
        const createdProduct = await tx.product.create({
            data: {
                name,
                description,
                price: parsedPrice,
                stock: parsedStock,
                vendorId,
                categoryId
            }
        });

        if (uploadedImages.length > 0) {
            await tx.image.createMany({
                data: uploadedImages.map(img => ({
                    ...img,
                    productId: createdProduct.id
                }))
            });
        }

        return createdProduct;
    });
    return product;
}

const updateProduct = async(productId, data) =>{
    const allowedUpdates = ['name', 'description', 'price', 'stock'];
    const updates = Object.keys(data);
    const isValid = updates.every((update)=> allowedUpdates.includes(update))
    if(!isValid)
        throw Error ("Invalid updates", 400, httpStatusText.ERROR);

    // Parse numeric fields if present
    if(data.price !== undefined) data.price = Number(data.price);
    if(data.stock !== undefined) data.stock = Number(data.stock);

    if(data.price !== undefined && (isNaN(data.price) || data.price < 0))
        throw Error("Price cannot be negative", 400, httpStatusText.ERROR);

    if(data.stock !== undefined && (!Number.isInteger(data.stock) || data.stock < 0))
        throw Error("Invalid stock value", 400, httpStatusText.ERROR);

    const product = await prisma.product.findUnique({where: {id: productId}, select:{id: true}})
    if(!product)
        throw Error("Product not found", 404, httpStatusText.FAIL);

    const updatedProduct = await prisma.product.update({where: {id: productId}, data})
    return updatedProduct;
}

const deleteProduct = async(productId) =>{
    const product = await prisma.product.findUnique({where: {id: productId}, select:{id: true}})
    if(!product)
        throw Error("Product not found", 404)

    // validate if product is part of any order
    const ordersWithProduct = await prisma.orderItem.findFirst({where: {productId}})
    if(ordersWithProduct)
        throw Error("Cannot delete product as it is part of existing orders", 400)

    await prisma.product.delete({where: {id: productId}})
    return;
}

const getVendorProducts = async(vendorId) =>{
    const products = await prisma.product.findMany({where: {vendorId}, include: {images: true}})
    if(!products)
        throw Error("No products found for this vendor", 404)
    return products;
}

module.exports = { createProduct, updateProduct, getAllProductsPaginated, getVendorProducts,deleteProduct };