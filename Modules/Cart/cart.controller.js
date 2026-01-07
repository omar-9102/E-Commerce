const cartService = require('./cart.services')

const addToCart = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const {productId, quantity} = req.body
        const item = await cartService.addToCart(productId, userId, quantity)
        return res.status(200).json({message: "Added to cart successfully", data: item});
    }catch(error){
        return next(error)
    }
}

const updateCart = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const {productId, quantity} = req.body
        const result = await cartService.updateCart(userId, productId, quantity)
        res.status(200).json({status: 'SUCCESS', data: result})
    }catch(error){
        return next(error)
    }
}

const getMyCart = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const result = await cartService.getMyCart(userId)
        res.status(200).json({status: 'SUCCESS', data: result})
    }catch(error){
        return next(error)
    }
}

const emptyCart = async(req, res, next) =>{
    console.log('In controller')
    try{
        const userId = req.user.id
        console.log('userId' , userId)
        const result = await cartService.emptyCart(userId)
        res.status(200).json({status: 'SUCCESS', data: result})

    }catch(error){
        return next(error)
    }
}

module.exports = {addToCart, updateCart, getMyCart, emptyCart}