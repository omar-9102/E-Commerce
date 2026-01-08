const cartService = require('./cart.services')
const asyncWrapper = require('express-async-handler')

const addToCart = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const {productId, quantity} = req.body
    const item = await cartService.addToCart(productId, userId, quantity)
    return res.status(200).json({message: "Added to cart successfully", data: item});
})

const updateCart = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const {productId, quantity} = req.body
    const result = await cartService.updateCart(userId, productId, quantity)
    res.status(200).json({status: 'SUCCESS', data: result})
})

const getMyCart = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const result = await cartService.getMyCart(userId)
    res.status(200).json({status: 'SUCCESS', data: result})
})

const emptyCart = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    console.log('userId' , userId)
    const result = await cartService.emptyCart(userId)
    res.status(200).json({status: 'SUCCESS', data: result})
})

module.exports = {addToCart, updateCart, getMyCart, emptyCart}