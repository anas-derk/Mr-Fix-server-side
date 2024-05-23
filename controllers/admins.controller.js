const { getResponseObject } = require("../global/functions");

const adminsOPerationsManagmentFunctions = require("../models/admins.model");

const { sign } = require("jsonwebtoken");

async function getAdminLogin(req, res) {
    try{
        const emailAndPassword = req.query;
        const result = await adminsOPerationsManagmentFunctions.adminLogin(emailAndPassword.email.trim().toLowerCase(), emailAndPassword.password);
        if (!result.error) {
            res.json({
                ...result,
                data: {
                    token: sign(result.data, process.env.secretKey, {
                        expiresIn: "1h",
                    }),
                }
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAdminInfo(req, res) {
    try{
        res.json(await adminsOPerationsManagmentFunctions.getAdminInfo(req.data._id));
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getRequestSenderInfo(req, res) {
    try{
        // جلب معلومات الطلب
        const requestAndUserIds = req.params;
        res.json(await adminsOPerationsManagmentFunctions.getRequestSenderInfo(req.data._id, requestAndUserIds.requestId, requestAndUserIds.userId))
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        // إعادة ضبط طلب السر من خلال المسؤول لتصبح نفس رقم الهاتف المُسجل
        res.json(await adminsOPerationsManagmentFunctions.resetPasswordForUserFromAdmin(req.data._id, req.params.mobilePhone));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    getAdminLogin,
    getAdminInfo,
    putResetPassword,
    getRequestSenderInfo,
}