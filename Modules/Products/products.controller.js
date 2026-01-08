const appError = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const productServices = require('./products.services')
const asyncWrapper = require('express-async-handler')

const createProduct = asyncWrapper(async(req, res) =>{
    const vendorId = req.user.id;
    const product = await productServices.createProduct({ ...req.body, vendorId }, req.files);
    return res.status(201).json({message: "Product created successfully", data: product});
})

const getAllProductsPaginated = asyncWrapper(async(req, res) =>{
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const products = await productServices.getAllProductsPaginated(page, limit);
    return res.status(200).json({message: "Products fetched successfully", data: products});
})

const getVendorProducts = asyncWrapper(async(req, res) =>{
    const vendorId = req.user.id;
    const products = await productServices.getVendorProducts(vendorId);
    return res.status(200).json({message: "Products fetched successfully", data: products});
})

const updateProduct = asyncWrapper(async(req, res) =>{
    const productId = req.params.id
    const updatedProduct = await productServices.updateProduct(productId, req.body);
    return res.status(200).json({message: "Product updated successfully", data: updatedProduct});
})

const deleteProduct = asyncWrapper(async(req, res) =>{
    const productId = req.params.id
    const vendorId = req.user.id
    await productServices.deleteProduct(productId, vendorId);
    return res.status(200).json({message: "Product deleted successfully"});
})

const review = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const {comment, rating} = req.body
    const productId = req.params.productId
    const review = await productServices.makeReview(userId, productId, rating, comment)
    res.status(200).json({message:"Thanks for review", data: review})
})

const getMyReviews = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const reviews = await productServices.getMyReviews(userId)
    res.status(200).json({message:"Here are all your reviews", data: reviews})
})

module.exports = {createProduct, getAllProductsPaginated, updateProduct, deleteProduct, getVendorProducts, review, getMyReviews};