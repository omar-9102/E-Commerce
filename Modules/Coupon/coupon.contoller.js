const couponServices = require('./coupon.services')
const httpStatusText = require('../../utils/httpStatusText')
const appError = require('../../utils/AppError');

const createCoupon = async(req, res, next) =>{
    try{
        userId = req.user.id
        const coupon = await couponServices.createCoupon(req.body, userId)
        return res.status(200).json({message:"Coupon created!", data:coupon})
    }catch(error){
        return next(error)
    }
}

const getMyCoupons = async(req, res, next) =>{
    try{
        const userId = req.user.id
        const coupons = await couponServices.getMyCoupons(userId)
        return res.status(200).json({message:"Here are your coupons", data: coupons})
    }catch(error){
        return next(error)
    }
}


module.exports = {createCoupon, getMyCoupons}
