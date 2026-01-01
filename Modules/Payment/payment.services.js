const prisma = require('../../lib/prisma.js');
const { createPaymobPayment } = require('../../utils/paymob.js');

const initiatePayment = async (orderId, userId) => {
    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    let payment = await prisma.payment.findUnique({ where: { orderId } });

    if (!payment) {
        payment = await prisma.payment.create({
            data: { 
                orderId, 
                amount: order.totalAmount, 
                status: "PENDING", 
                method: "CARD" 
            }
        });
    }

    const merchantOrderId = `${orderId}_${Date.now()}`;

    const paymentUrl = await createPaymobPayment({
        amount: Number(order.totalAmount),
        merchantOrderId: merchantOrderId,
        userId: userId
    });

    await prisma.payment.update({
        where: { id: payment.id },
        data: { paymobOrderId: merchantOrderId }
    });

    return paymentUrl;
};

module.exports = { initiatePayment };