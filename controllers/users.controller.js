const { getResponseObject } = require("../global/functions");

const usersOPerationsManagmentFunctions = require("../models/users.model");

const { sign } = require("jsonwebtoken");

async function createNewUser(req, res) {
    try{
        // إنشاء حساب
        res.json(await usersOPerationsManagmentFunctions.createNewUser(req.body));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

function getForgetPassword(req, res) {
    // جلب الإيميل المرسل
    const email = req.query.email;
    // التحقق إن تمّ إرساله
    if (email) {
        // التحقق من أنه إيميل صالح
        const { isEmail } = require("../global/functions");
        if (isEmail(email)) {
            const { isUserAccountExist } = require("../models/users.model");
            // في حالة كان الإيميل صالح نتحقق من كون المستخدم موجود
            isUserAccountExist(email).then((userIdAndType) => {
                // التحقق من أن النتيجة المعادة هي رقم معرّف المستخدم ونوع المستخدم 
                if (userIdAndType) {
                    // إرسال كود إلى الإيميل
                    const { sendCodeToUserEmail } = require("../global/functions");
                    sendCodeToUserEmail(email)
                        .then(generatedCode => {
                            // إرجاع البيانات المطلوبة لعملية إعادة ضبط كلمة السر
                            res.json(
                                {
                                    userIdAndType,
                                    code: generatedCode[0],
                                }
                            );
                        })
                        // في حالة حدث خطأ نعيد الخطأ للمستخدم
                        .catch(err => res.json(err));
                } else {
                    // في حالة كان البريد الالكتروني غير موجود نرسل رسالة خطأ
                    res.json("عذراً البريد الالكتروني الذي أدخلته غير موجود !!");
                }
            })
                .catch((err) => res.json(err));
        }
        else {
            // في حالة كان ا لإيميل غير صالح نرسل رسالة خطأ كاستجابة للمستخدم
            res.status(500).json("عذراً ، الإيميل الذي أدخلته غير صالح !!!");
        }
    }
    else {
        // في حالة لم يتم إرسال الإيميل من قبل المستخدم نعيد رسالة خطأ للسمستخدم 
        res.status(500).json("الرجاء إرسال الإيميل المطلوب لاستعادة كلمة السر الخاصة به");
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
        res.json(await usersOPerationsManagmentFunctions.updateProfile(req.data._id, req.body, isSameOfEmail, req.query.isSameOfEmail, req.query.isSameOfMobilePhone));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function putResetPassword(req, res) {
    try{
        const userTypeAndNewPassword = req.query;
        res.json(await usersOPerationsManagmentFunctions.resetUserPassword(req.params.userId, userTypeAndNewPassword.userType, userTypeAndNewPassword.newPassword));

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