const { getResponseObject } = require("../global/functions");

const usersOPerationsManagmentFunctions = require("../models/users.model");

const { sign } = require("jsonwebtoken");

const {
    isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate,
    addNewAccountVerificationCode,
    isAccountVerificationCodeValid
} = require("../models/account_codes.model");

async function createNewUser(req, res) {
    try{
        // إنشاء حساب
        res.json(await usersOPerationsManagmentFunctions.createNewUser(req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getForgetPassword(req, res) {
    try{
        const email = req.query.email;
        let result = await usersOPerationsManagmentFunctions.isUserAccountExist(email);
        if (!result.error) {
            result = await isBlockingFromReceiveTheCodeAndReceiveBlockingExpirationDate(email);
            if (result.error) {
                res.json(result);
                return;
            }
            result = await sendCodeToUserEmail(email);
            if (!result.error) {
                res.json(await addNewAccountVerificationCode(email, result.data, "to reset password"));
                return;
            }
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function login(req, res) {
    try{
        // جلب بيانات تسجيل الدخول الخاصة بالمستخدم
        const text = req.query.text,
            password = req.query.password;
        // في حالة كان إيميل صالح أو رقم صالح فإننا نقوم بعملية تسجيل الدخول
        const result = await usersOPerationsManagmentFunctions.login(text, password);
        if (!result.error) {
            const token = sign(result.data, process.env.secretKey, {
                expiresIn: "1h",
            });
            res.json({
                msg: result.msg,
                error: result.error,
                data: {
                    ...result.data,
                    token,
                },
            });
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getUserInfo(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.getUserInfo(req.data._id));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putProfile(req, res) {
    try{
        res.json(await usersOPerationsManagmentFunctions.updateProfile(req.data._id, req.body, req.query.isSameOfEmail, req.query.isSameOfEmail, req.query.isSameOfMobilePhone));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const resetingData = req.query;
        let result = await isAccountVerificationCodeValid(resetingData.email, resetingData.code, "to reset password");
        if (!result.error) {
            res.json(await usersOPerationsManagmentFunctions.resetUserPassword(resetingData.email, resetingData.newPassword, resetingData.userType));
            return;
        }
        res.json(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

// تصدير الدوال التي تمّ تعريفها
module.exports = {
    createNewUser,
    login,
    getUserInfo,
    putProfile,
    getForgetPassword,
    putResetPassword,
}