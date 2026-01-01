const httpStatusText = require('../../utils/httpStatusText')
const prisma = require('../../lib/prisma');
const appError = require('../../utils/AppError');
const { Decimal } = require('@prisma/client/runtime/client');
const { Prisma } = require('@prisma/client');

const checkOut = async(userId) =>{
    // get the cart with items
    const cart = await prisma.cart.findUnique({
        where:{userId},
        include:{
            items:{
                include:{product: true}
            }
        }
    })

    if(!cart || cart.items.length === 0)
        throw appError.create("Cart is empty", 404, httpStatusText.FAIL)

    let totalAmount = new Prisma.Decimal(0)
    const orderItemsData = cart.items.map(item =>{
        const itemTotal = new Prisma.Decimal(item.product.price).mul(item.quantity)
        totalAmount = totalAmount.add(itemTotal)
        return {productId: item.productId, quantity: item.quantity, priceAtPurchase: item.product.price}
    })

    const order = await prisma.$transaction(async(tx) =>{
        const newOrder = await tx.order.create({
            data:{
                userId,
                totalAmount,
                status: 'PENDING',
                items:{
                    create:orderItemsData
                }
            }
        })
        await tx.cartItem.deleteMany({where:{cartId: cart.id}})
        return newOrder
    })
    return order;
}

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

// const updateOrderQuantity
module.exports = {checkOut, viewMyOrder, viewSingleOrder}