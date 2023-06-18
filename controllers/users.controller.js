function createNewUser(req, res) {
    // جلب الداتا المطلوبة المرسلة مع الطلب
    let firstAndLastName = req.body.firstAndLastName,
        email = req.body.email,
        mobilePhone = req.body.mobilePhone,
        password = req.body.password,
        gender = req.body.gender,
        birthday = req.body.birthday,
        city = req.body.city,
        address = req.body.address;
    // التحقق فيما إذا كانت الحقول المرسلة موجودة أم لم يتم إرسالها
    if (firstAndLastName.length > 0 && mobilePhone.length > 0
        && password.length > 0 && gender.length > 0 && birthday.length > 0
        && city.length > 0 && address.length > 0) {
        if (email.length > 0) {
            const { isEmail } = require("../global/functions");
            // التحقق من كون الحقل email أنه إيميل أم لا
            if (isEmail(email)) {
                const { createNewUser } = require("../models/users.model");
                // إنشاء حساب
                createNewUser(req.body).then((msg) => {
                    // إعادة الرسالة إلى المستخدم كاستجابة
                    res.json(msg);
                })
                    // في حالة حدث خطأ إعادته للمستخدم
                    .catch((err) => res.json(err));
            }
            else {
                // إذا لم يكن الإيميل المرسل صالح إعادة رسالة خطأ
                res.status(500).json("عذراً ، الإيميل المرسل غير صالح");
            }
        } else {
            const { createNewUser } = require("../models/users.model");
            // إنشاء حساب
            createNewUser(req.body).then((msg) => {
                // إعادة الرسالة إلى المستخدم كاستجابة
                res.json(msg);
            })
            // في حالة حدث خطأ إعادته للمستخدم
            .catch((err) => res.json(err));
        }
    }
    else {
        // في حالة أحد الحقول غير مرسلة عندها نعيد للمستخدم رسالة خطأ
        res.status(500).json("عذراً أحد الحقول غير موجودة ، الرجاء إرسال كل الحقول");
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

function login(req, res) {
    // جلب بيانات تسجيل الدخول الخاصة بالمستخدم
    let text = req.query.text,
        password = req.query.password;
    // التحقق من أن النص وكلمة السر قد تمّ إرسالها
    if (text.length > 0 && password.length > 0) {
        // التحقق من البيانات قبل إرسالها لقاعدة البيانات ( هل النص المرسل هو إيميل صالح أو رقم صالح )
        const { isEmail, isNumber } = require("../global/functions");
        if (isEmail(text) || isNumber(text)) {
            // في حالة كان إيميل صالح أو رقم صالح فإننا نقوم بعملية تسجيل الدخول
            const { login } = require("../models/users.model");
            login(text, password).then((result) => {
                // إعادة النتيجة للمستخدم
                res.json(result);
            })
                // إعادة رسالة خطأ في حالة حدث خطأ أثناء عملية تسجيل الدخول
                .catch((err) => res.json(err));
        } else {
            // إعادة رسالة خطأ في حالة كان النص ليس إيميل أو رقم هاتف صالح
            res.status(500).json("خطأ ، عذراً النص الذي أرسلته ليس إيميل أو رقم صالح");
        }
    } else {
        // في حالة لم يتم إرسال قيم أحد الحقول أو كلاهما عندها نرسل رسالة خطأ للمستخدم
        res.status(500).json("عذراً ، أحد الحقول لم يتم إرسالها");
    }
}

function getUserInfo(req, res) {
    // جلب رقم معرّف المستخدم
    let userId = req.params.userId;
    // التحقق من أنه قد تمّ إرساله فعلاً
    if (!userId) res.status(500).json("عذراً ، يجب إرسال رقم معرّف المستخدم");
    else {
        // جلب معلومات المستخدم
        const { getUserInfo } = require("../models/users.model");
        getUserInfo(userId).then((result) => {
            // إعادة النتيجة للمستخدم
            res.json(result);
        })
            // إعادة رسالة الخطأ في حالة حدثت مشكلة أثناء جلب بيانات المستخدم
            .catch((err) => res.json(err));
    }
}

function putProfile(req, res) {
    // جلب المعلومات المرسلة
    let userId = req.params.userId,
        newUserData = req.body,
        isSameOfEmail = req.query.isSameOfEmail;
    isSameOfMobilePhone = req.query.isSameOfMobilePhone;
    // التحقق من أنّ رقم معرّف المستخدم قد تمّ إرساله فعلاً
    if (!userId) res.status(500).json("Sorry, Please Send User Id !!");
    else {
        // تعديل بيانات المستخدم
        const { updateProfile } = require("../models/users.model");
        updateProfile(userId, newUserData, isSameOfEmail, isSameOfMobilePhone).then((result) => {
            // إعادة النتيجة للمستخدم
            res.json(result);
        })
            // إعادة رسالة الخطأ في حالة حدثت مشكلة بعملية تعديل بيانات المستخدم
            .catch((err) => res.json(err));
    }
}

function putResetPassword(req, res) {
    // جلب المعلومات المرسلة
    let userId = req.params.userId,
        userType = req.query.userType;
    // التحقق من كون المعلومات قد تمّ إرسالها فعلاً
    if (!userId || !userType) res.status(500).json("عذراً الرجاءإرسال معرّف مستخدم ، أو نوع الحساب أو كلاهما !!");
    else {
        // جلب كلمة المرور الجديدة
        let newPassword = req.query.newPassword;
        // إعادة ضبط كلمة المرور
        const { resetUserPassword } = require("../models/users.model");
        resetUserPassword(userId, userType, newPassword).then((result) => {
            // إعادة النتيجة للمستخدم
            res.json(result);
        })
            // إعادة رسالة الخطأ للمستخدم في حالة حدثت مشكلة أثناء عملية إعادة ضبط كلمة المرور
            .catch((err) => res.json(err));
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