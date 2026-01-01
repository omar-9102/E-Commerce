const crypto = require('crypto');
const paymobConfig = require('../config/paymob.config');

const verifyHmac = (queryData, receivedHmac) => {
    // الترتيب الصارم اللي Paymob طالباه
    const keys = [
        'amount_cents',
        'created_at',
        'currency',
        'error_occured',
        'has_parent_transaction',
        'id',
        'integration_id',
        'is_3d_secure',
        'is_auth',
        'is_capture',
        'is_refunded',
        'is_standalone_payment',
        'is_voided',
        'order', // ده لازم يرجع الـ ID بس (رقم)
        'owner',
        'pending',
        'source_data.pan',
        'source_data.sub_type',
        'source_data.type',
        'success'
    ];

    let concatenatedString = "";

    keys.forEach((key) => {
        let value;
        
        // هندلة الـ Nested Objects زي source_data
        if (key.includes('.')) {
            const parts = key.split('.');
            value = queryData[parts[0]]?.[parts[1]];
        } else {
            value = queryData[key];
        }

        // تركة الـ Order ID: لو الـ order عبارة عن object، بناخد الـ id اللي جواه
        if (key === 'order' && typeof value === 'object' && value !== null) {
            value = value.id;
        }

        // تحويل القيم لـ String وإضافة الخانات الفارغة لو القيمة null
        concatenatedString += (value !== undefined && value !== null) ? String(value) : "";
    });

    console.log("🛠️ Corrected Concatenated String:", concatenatedString);

    const calculatedHmac = crypto
        .createHmac('sha512', paymobConfig.hmacSecret)
        .update(concatenatedString)
        .digest('hex');

    return calculatedHmac === receivedHmac;
};

module.exports = { verifyHmac };