const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const productServices = require('./products.services')

const createProduct = async(req, res, next) =>{
    try{
        const vendorId = req.user.id;
        const product = await productServices.createProduct({ ...req.body, vendorId }, req.files);
        return res.status(201).json({message: "Product created successfully", data: product});
    }catch(error){
        return next(error);
    }
}

const getAllProductsPaginated = async(req, res, next) =>{
    try{
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const products = await productServices.getAllProductsPaginated(page, limit);
        return res.status(200).json({message: "Products fetched successfully", data: products});
    }catch(error){
        return next(appErrors.create(error.message, 500, httpStatusText.ERROR) );
    }
}

const getVendorProducts = async(req, res, next) =>{
    try{
        const vendorId = req.user.id;
        const products = await productServices.getVendorProducts(vendorId);
        return res.status(200).json({message: "Products fetched successfully", data: products});
    }catch(error){
        return next(appError.create(error.message, 500, httpStatusText.ERROR) );
    }
}

const updateProduct = async(req, res, next) =>{
    try{
        const productId = req.params.id
        const updatedProduct = await productServices.updateProduct(productId, req.body);
        return res.status(200).json({message: "Product updated successfully", data: updatedProduct});
    }catch(error){
        return next(appError.create(error.message, 500, httpStatusText.ERROR) );
    }
}

const deleteProduct = async(req, res, next) =>{
    try{
        const productId = req.params.id
        const vendorId = req.user.id
        await productServices.deleteProduct(productId, vendorId);
        return res.status(200).json({message: "Product deleted successfully"});
    }catch(error){
        return next(appError.create(error.message, 500, httpStatusText.ERROR) );
    }
}

const review = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const {comment, rating} = req.body
        const productId = req.params.productId
        const review = await productServices.makeReview(userId, productId, rating, comment)
        res.status(200).json({message:"Thanks for review", data: review})
    }catch(error){
        return next(error)
    }
}

const getMyReviews = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const reviews = await productServices.getMyReviews(userId)
        res.status(200).json({message:"Here are all your reviews", data: reviews})
    }catch(error){
        return next(error)
    }
}

module.exports = {createProduct, getAllProductsPaginated, updateProduct, deleteProduct, getVendorProducts, review, getMyReviews};