const httpStatusText = require('../../utils/httpStatusText')
const prisma = require('../../lib/prisma');
const appError = require('../../utils/AppError');
const { get } = require('./cart.routes');

const addToCart = async(productId, userId, quantity)=>{
    let cart = await prisma.cart.findUnique({where:{userId: userId}})
    const product = await prisma.product.findUnique({where:{id: productId}})
    if(!product)
        throw appError.create("Product not found", 404, httpStatusText.FAIL)
    if(product.stock < quantity)
        throw appError.create("Insufficient stock", 400, httpStatusText.ERROR)
    if(!cart){
        cart = await prisma.cart.create({data:{userId}})
    }

    // 3️⃣ Add or update cart item
    const cartItem = await prisma.cartItem.upsert({
        where: {
            cartId_productId: {
            cartId: cart.id,
            productId
        }
    },
        update: {
            quantity: {
            increment: quantity
        }
    },
        create: {
            cartId: cart.id,
            productId,
        quantity
        }
})

    return cartItem
}

const updateCart = async (userId, productId, quantity) =>{
    if(quantity < 0)
        throw appError.create("Quantity cannot be negative value")

    const cart = await prisma.cart.findUnique({where:{userId}})
    if(!cart)
        throw appError.create("Cart not found", 404, httpStatusText.ERROR)

    const cartItem = await prisma.cartItem.findUnique({where:{cartId_productId: {cartId: cart.id, productId}}})
    if(!cartItem)
        throw appError.create("Product is not in the cart", 404, httpStatusText.ERROR)

    if(quantity === 0){
        await prisma.cartItem.delete({where:{cartId_productId:{cartId: cart.id, productId}}})
        return {message: "Item removed from cart"}
    }

    const product = await prisma.product.findUnique({where:{id: productId}})
    if(quantity > product.stock)
        throw appError.create("Quantity exceeds available stock", 400, httpStatusText.FAIL)

    const updatedItem = await prisma.cartItem.update({
        where:{
            cartId_productId:{
                cartId: cart.id,
                productId
            }
        },
        data: {quantity}
    })
    return updatedItem
}

const getMyCart = async(userId) =>{
    const cartWithItems = await prisma.cart.findUnique({
        where:{userId},
        select:{
            id: true,
            items: {
                select:{
                    quantity: true,
                    product:{
                        select:{
                            id: true,
                            name: true,
                            price: true,
                            images: true
                        }
                    }
                }
            }
        }
    })
    return cartWithItems
}

const emptyCart = async(userId) =>{
    console.log('In the service')
    const cart = await prisma.cart.findUnique({where:{userId}})
    console.log(cart)
    if(!cart)
        throw appError.create("Cart not found", 404, httpStatusText.ERROR)

    const cartItems = await prisma.cartItem.deleteMany({where:{cartId:cart.id}})
    console.log(cartItems)
    if(cartItems.count === 0)
        throw appError.create("Cart already empty")

    return {message: cartItems.count === 0 ? "Cart already empty" : "Cart emptied successfully", 
            deleted_count: cartItems.count}
}

module.exports = {addToCart, updateCart, getMyCart, emptyCart};