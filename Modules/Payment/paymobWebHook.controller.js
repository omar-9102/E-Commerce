const prisma = require("../../lib/prisma");
const { verifyHmac } = require("../../utils/paymentHelper");

const paymobWebhook = async (req, res) => {
    try {
        const hmac = req.query.hmac;
        const data = req.body.obj;

        if (!data) {
            console.log("❌ Error: No data object found in request body");
            return res.status(400).send("Bad Request");
        }

        // 1. HMAC Protection
        if (!hmac) {
            console.log("❌ HMAC is missing");
            return res.status(401).send("Unauthorized");
        }

        const isValid = verifyHmac(data, hmac);
        if (!isValid) {
            console.log("❌ HMAC Verification Failed!");
            return res.status(401).send("Unauthorized");
        }

        const merchant_order_id = data.merchant_order_id || (data.order && data.order.merchant_order_id);
        const success = String(data.success) === "true";

        if (!merchant_order_id) {
            return res.status(400).send("Order ID missing");
        }

        // 2. Find the payment and include the Order + OrderItems to know what was bought
        const paymentRecord = await prisma.payment.findFirst({
            where: { paymobOrderId: merchant_order_id.toString() },
            include: { 
                order: { 
                    include: { items: true } // Assuming your Order model has 'items'
                } 
            }
        });

        if (!paymentRecord) {
            console.log(`⚠️ Payment record not found for: ${merchant_order_id}`);
            return res.sendStatus(200); 
        }

        // 3. Avoid processing if the order is already paid
        if (paymentRecord.order.status === "PAID") {
            return res.sendStatus(200);
        }

        // 4. Update status and decrease stock in one Transaction
        await prisma.$transaction(async (tx) => {
            // Update Payment Status
            await tx.payment.update({
                where: { id: paymentRecord.id },
                data: { status: success ? "COMPLETED" : "FAILED" }
            });

            if (success) {
                // Update Order Status to PAID
                await tx.order.update({
                    where: { id: paymentRecord.orderId },
                    data: { status: "PAID" }
                });

                // --- NEW: DECREASE STOCK LOGIC ---
                // Loop through each item in the order and decrement product stock
                for (const item of paymentRecord.order.items) {
                    await tx.product.update({
                        where: { id: item.productId },
                        data: {
                            // Using the atomic decrement helper from Prisma
                            stock: {
                                decrement: item.quantity
                            }
                        }
                    });
                }
                // ---------------------------------
            }
        });

        console.log(`✅ Success: Payment status updated and stock decreased for order ${merchant_order_id}`);
        res.sendStatus(200);

    } catch (error) {
        console.error("❌ Webhook Error:", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { paymobWebhook };