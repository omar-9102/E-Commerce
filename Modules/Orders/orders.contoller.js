const { order } = require('../../lib/prisma');
const { message } = require('../../utils/AppError');
const orderService = require('./orders.services')

const orderNow = async(req, res, next)=> {
    try{
        const userId = req.user.id
        const {couponcode} = req.body
        const result = await orderService.checkOut(userId, couponcode)
        return res.status(200).json({message: "Order made successfully", data: result});
    }catch(error){
        return next(error)
    }
}

const viewAllOrders = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const result = await orderService.viewMyOrder(userId)
        return res.status(200).json({message: "Your orders!", data: result});
    }catch(error){
        return next(error)
    }
}

const viewSingleOrder = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const {orderId} = req.params
        console.log('userId', userId)
        console.log('orderId', orderId)
        const order = await orderService.viewSingleOrder(userId, orderId)
        console.log(order)
        return res.status(200).json({message: 'Your order is here', data: order})
    }catch(error){
        return next(error)
    }
}

module.exports = {orderNow, viewAllOrders, viewSingleOrder}