const httpStatusText = require('../../utils/httpStatusText')
const prisma = require('../../lib/prisma');
const appError = require('../../utils/AppError');
const { Decimal } = require('@prisma/client/runtime/client');
const { Prisma } = require('@prisma/client');


const viewMyOrder = async(userId) =>{
    console.log('In service')
    const order = await prisma.order.findMany({
        where:{userId},
        orderBy:{createdAt: 'desc'},
        include:{
            items:{
                select:{
                    id: true,
                    quantity: true,
                    priceAtPurchase: true,
                    product:{
                        select:{
                            id: true,
                            name: true,
                            images: true
                        }
                    }
                }
            }
        }

    })
    console.log(order)
    return order
}

const viewSingleOrder = async(userId, orderId) =>{
    const order = await prisma.order.findFirst({
        where:{
            id: orderId,
            userId
        },
        include:{
            items:{
                select:{
                    id: true,
                    quantity: true,
                    priceAtPurchase: true,
                    product:{
                        select:{
                            id: true,
                            name: true,
                            images: true
                        }
                    }
                }
            }
        }
    })
    return order
}

const fetchCartOrFail = async(userId) =>{
    const cart = await prisma.cart.findUnique({where:{userId},
    include:{
        items:{
            include:{
                product: true
            }
        }
    }
    })
    if(!cart || cart.items.length === 0)
        throw appError.create("Cart is empty", 404, httpStatusText.FAIL)

    return cart
}

const validateCoupon = async(couponcode) => {
    if(!couponcode) return null;
    const coupon = await prisma.coupon.findUnique({where:{code: couponcode.toUpperCase()}})
    const now = new Date()

    if(!coupon || !coupon.isActive || now < coupon.startDate || now > coupon.endDate)
        throw appError.create("Invalid or expired coupon", 400, httpStatusText.ERROR)

    if(coupon.usageLimit && coupon.usedCount >= coupon.usageLimit)
        throw appError.create("Coupon usage limit reached", 400, httpStatusText.ERROR)

    return coupon
}

const calculateCartTotals = (cart, coupon) => {
    let originalTotal = new Prisma.Decimal(0);
    let vendorSubtotal = new Prisma.Decimal(0);

    const orderItems = [];

    for (const item of cart.items) {
        const price = new Prisma.Decimal(item.product.price);
        const quantity = new Prisma.Decimal(item.quantity);
        const lineTotal = price.mul(quantity);

        originalTotal = originalTotal.add(lineTotal);

        if (coupon && item.product.vendorId === coupon.vendorId) {
            vendorSubtotal = vendorSubtotal.add(lineTotal);
        }

        orderItems.push({
            productId: item.productId,
            quantity: item.quantity,
            priceAtPurchase: item.product.price
        });
    }

    return { originalTotal, vendorSubtotal, orderItems };
};

const calculateDiscount = (coupon, vendorSubtotal) => {
    if (!coupon || vendorSubtotal.lte(0)) {
        return new Prisma.Decimal(0);
    }

    if (coupon.type === "PERCENTAGE") {
        let discount = vendorSubtotal.mul(
            new Prisma.Decimal(coupon.discount).div(100)
        );

        if (coupon.maxDiscount) {
            discount = Prisma.Decimal.min(discount, coupon.maxDiscount);
        }

        return discount;
    }

    if (coupon.type === "FIXED") {
        return Prisma.Decimal.min(coupon.discount, vendorSubtotal);
    }
};

const checkOut = async (userId, couponCode = null) => {
    const cart = await fetchCartOrFail(userId);
    const coupon = await validateCoupon(couponCode);

    const { originalTotal, vendorSubtotal, orderItems } =
        calculateCartTotals(cart, coupon);

    const totalDiscount =
        calculateDiscount(coupon, vendorSubtotal);

    // const totalAmount = originalTotal.min(totalDiscount);
    const totalAmount = originalTotal - totalDiscount

    return prisma.$transaction(async (tx) => {
        const order = await tx.order.create({
            data: {
                userId,
                originalTotal,
                totalDiscount,
                totalAmount,
                status: "PENDING",
                couponId: coupon?.id,
                items: { create: orderItems }
            }
        });

        await tx.cartItem.deleteMany({
            where: { cartId: cart.id }
        });

        return order;
    });
};
module.exports = {checkOut, viewMyOrder, viewSingleOrder}