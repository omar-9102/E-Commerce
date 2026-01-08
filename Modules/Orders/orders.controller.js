const orderService = require('./orders.services')
const asyncWrapper = require('express-async-handler')


const orderNow = asyncWrapper(async(req, res)=> {
    const userId = req.user.id
    const {couponcode} = req.body
    const result = await orderService.checkOut(userId, couponcode)
    return res.status(200).json({message: "Order made successfully", data: result});
})

const viewAllOrders = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const result = await orderService.viewMyOrder(userId)
    return res.status(200).json({message: "Your orders!", data: result});
})

const viewSingleOrder = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const {orderId} = req.params
    const order = await orderService.viewSingleOrder(userId, orderId)
    return res.status(200).json({message: 'Your order is here', data: order})
})

module.exports = {orderNow, viewAllOrders, viewSingleOrder}