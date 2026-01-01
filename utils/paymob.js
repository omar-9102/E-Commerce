const axios = require("axios");
const paymobConfig = require("../config/paymob.config");
const appError = require("./AppError")
const httpStatusText = require('./httpStatusText')
const prisma = require('../lib/prisma')

const createPaymobPayment = async ({ amount, merchantOrderId, userId }) => {
    try {

        const user = await prisma.user.findUnique({where:{id:userId}})
        if(!user)
            throw appError.create("User not found", 404, httpStatusText.ERROR)
        // 1️⃣ المصادقة (Authentication)
        const authResponse = await axios.post(
            "https://accept.paymob.com/api/auth/tokens",
            { api_key: paymobConfig.apiKey }
        );
        const authToken = authResponse.data.token;

        // 2️⃣ إنشاء طلب Paymob
        const orderResponse = await axios.post(
            "https://accept.paymob.com/api/ecommerce/orders",
            {
                auth_token: authToken,
                delivery_needed: false,
                amount_cents: Math.round(amount * 100),
                currency: "EGP",
                merchant_order_id: merchantOrderId, // نستخدم المعرف الفريد هنا 
                items: []
            }
        );
        const paymobOrderId = orderResponse.data.id;

        // 3️⃣ توليد مفتاح الدفع (Payment Key)
        const paymentKeyResponse = await axios.post(
            "https://accept.paymob.com/api/acceptance/payment_keys",
            {
                auth_token: authToken,
                amount_cents: Math.round(amount * 100),
                expiration: 3600,
                order_id: paymobOrderId,
                billing_data: {
                    first_name: user.firstName, // يفضل جلبها من بيانات المستخدم مستقبلاً
                    last_name: user.lastName,
                    email: user.email,
                    phone_number: user.phone ?? "01000000000",
                    apartment: "NA", floor: "NA", street: "NA", building: "NA",
                    shipping_method: "NA", postal_code: "NA", city: "Cairo",
                    country: "EG", state: "Cairo"
                },
                currency: "EGP",
                integration_id: paymobConfig.integrationId
            }
        );
        
        const paymentKey = paymentKeyResponse.data.token;

        // 4️⃣ إرجاع رابط الـ Iframe
        return `https://accept.paymob.com/api/acceptance/iframes/${paymobConfig.iframeId}?payment_token=${paymentKey}`;
    } catch (error) {
        console.error("Paymob Error:", error.response?.data || error.message);
        throw new Error("Failed to create Paymob payment");
    }
};

module.exports = { createPaymobPayment };