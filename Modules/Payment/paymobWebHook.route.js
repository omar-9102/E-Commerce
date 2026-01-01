const express = require('express')
const router = express.Router();
const webHookController = require("./paymobWebHook.controller")


router.post("/paymob", webHookController.paymobWebhook);

module.exports = router

