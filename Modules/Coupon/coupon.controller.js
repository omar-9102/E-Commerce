const couponServices = require('./coupon.services')
const asyncWrapper = require('express-async-handler')

const createCoupon = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const coupon = await couponServices.createCoupon(req.body, userId)
    return res.status(200).json({message:"Coupon created!", data:coupon})
})

const getMyCoupons = asyncWrapper(async(req, res) =>{
    const userId = req.user.id
    const coupons = await couponServices.getMyCoupons(userId)
    return res.status(200).json({message:"Here are your coupons", data: coupons})
})


module.exports = {createCoupon, getMyCoupons}
