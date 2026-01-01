module.exports = {
    apiKey: process.env.PAYMOB_API_KEY,       // Your Paymob API key (auth)
    integrationId: process.env.PAYMOB_INTEGRATION_ID, // Integration ID for iframe/payment
    iframeId: process.env.PAYMOB_IFRAME_ID,   // Iframe ID from Paymob dashboard
    hmacSecret: process.env.PAYMOB_HMAC_SECRET // أضف هذا السطر
};
