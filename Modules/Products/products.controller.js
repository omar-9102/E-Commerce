const appErrors = require('../../utils/AppError');
const httpStatusText = require('../../utils/httpStatusText');
const productServices = require('./products.services')

const createProduct = async(req, res, next) =>{
    try{
        const product = await productServices.createProduct(req.body)
        return res.status(201).json({message: "Product created successfully", data: product});
    }catch(error){
        return next(appErrors.create(error.message, 500, httpStatusText.ERROR) );
    }
}

module.exports = {createProduct}