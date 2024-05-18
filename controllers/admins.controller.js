const { getResponseObject } = require("../global/functions");

const adminsOPerationsManagmentFunctions = require("../models/admins.model");

const { sign } = require("jsonwebtoken");

async function getAdminLogin(req, res) {
    try{
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
        res.json(await adminsOPerationsManagmentFunctions.getRequestSenderInfo(requestAndUserIds.requestId, requestAndUserIds.userId))
    }
    catch(err){
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

function putResetPassword(req, res) {
    // جلب رقم الهاتف
    const mobilePhone = req.params.mobilePhone;
    // في حالة لم يتم إرسال رقم الموبايل فإننا نرجع رسالة خطأ
    if (!mobilePhone) {
        res.json("الرجاء إرسال رقم موبايل !!!");
    } else {
        // إعادة ضبط طلب السر من خلال المسؤول لتصبح نفس رقم الهاتف المُسجل
        const { resetPasswordForUserFromAdmin } = require("../models/admins.model");
        resetPasswordForUserFromAdmin(mobilePhone).then((result) => {
            // إرجاع النتيجة للمستخدم
            res.json(result);
        })
        // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية إعادة ضبط كلمة السر من قبل المسؤول
            .catch((err) => res.json(err));
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    getAdminLogin,
    getAdminInfo,
    putResetPassword,
    getRequestSenderInfo,
}