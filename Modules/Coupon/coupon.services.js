const httpStatusText = require('../../utils/httpStatusText')
const prisma = require('../../lib/prisma');
const appError = require('../../utils/AppError');

const createCoupon = async(data, vendorId) =>{
    const code = data.code.toUpperCase()
    const existingCode = await prisma.coupon.findUnique({where:{code}})
    if(existingCode)
        throw appError.create("Coupon already exist", 400, httpStatusText.ERROR)

    if(data.type === 'PERCENTAGE'){
        if(data.discount <= 0 || data.discount > 100)
            throw appError.create("Percentage discount must be between 1 and 100", 400, httpStatusText.ERROR)
    }
    return prisma.coupon.create({
        data:{
            ...data,
            code,
            vendorId
        }
    })
}

const deactivateCoupon = async(couponId, vendorId) =>{
    const coupon = await prisma.coupon.findUnique({where:{id: couponId}})
    if(!coupon)
        throw appError.create("Coupon not found", 404, httpStatusText.ERROR)
    
    if(coupon.vendorId !== vendorId)
        throw appError.create("Unauthorized you can only manage your coupons", 403, httpStatusText.FAIL)

    return prisma.coupon.update({
        where:{id: couponId},
        data: {isActive: false}
    })
}

const getMyCoupons = async(userId) =>{
    const coupons = await prisma.coupon.findMany({where:{vendorId: userId}});
    if(coupons.length === 0)
        throw appError.create("You have not made coupons yet", 404, httpStatusText.FAIL)
    return coupons
}

module.exports = {deactivateCoupon, createCoupon, getMyCoupons}