function getAdminLogin(req, res) {
    // جلب الإيميل وكلمة السر المطلوبين للتسجيل
    let email = req.query.email,
        password = req.query.password;
    // التحقق من أنّ الإيميل وكلمة السر قد تم إرسالهم بالفعل
    if (email.length > 0 && password.length > 0) {
        // التحقق من أنّ الإيميل المرسل هو إيميل صالح
        const { isEmail } = require("../global/functions");
        if (isEmail(email)) {
            // طلب تسجيل الدخول بما أنّنا تأكدنا من انّ الإيميل وكلمة السر قد تمّ إرسالها فعلاً بالإضافة لأنّ الإيميل صالح
            const { adminLogin } = require("../models/admin.model");
            adminLogin(email, password).then((result) => {
                // إرجاع النتيجة للمستخدم
                res.json(result);
            })
            // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية تسجيل الدخول
                .catch((err) => res.json(err));
        } else {
            // إرجاع رسالة خطأ في حالة الإيميل غير صالح
            res.status(500).json("عذراً الإيميل الذي أرسلته غير صالح !!!");
        }
    } else {
        // إرجاع رسالة خطأ في حالة لم يتم إرسال الإيميل أو كلمة السر أو كلاهما
        res.status(500).json("عذراً لم يتم إرسال الإيميل أو كلمة السر أو كلاهما !!");
    }
}

function getAdminInfo(req, res) {
    // جلب رقم معرّف المسؤول
    let adminId = req.params.adminId;
    // إذا لم يُرسل رقم المعرّف فعلياً فإننا نرجع رسالة خطأ
    if (!adminId) {
        res.json("الرجاء إرسال معرّف للمسؤول !!!");
    } else {
        // جلب معلومات المسؤول
        const { getAdminInfo } = require("../models/admin.model");
        getAdminInfo(adminId).then((result) => {
            // إرجاع النتيجة للمستخدم
            res.json(result);
        })
        // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية جلب بيانات المسؤول
            .catch((err) => res.json(err));
    }
}

function getRequestSenderInfo(req, res) {
    // جلب معلومات الطلب
    let requestId = req.params.requestId,
        userId = req.params.userId;
    // إذا لم يتم إرسال رقم معرّف المستخدم ورقم معرّف الطلب فإننا نرجع رسالة خطأ
    if (!requestId || !userId) {
        res.json("الرجاء إرسال معرّف المستخدم ومعرّف !!!");
    } else {
        // جلب معلومات مُرسل الطلب
        const { getRequestSenderInfo } = require("../models/admin.model");
        getRequestSenderInfo(requestId, userId).then((result) => {
            // إعادة النتيجة للمستخدم
            res.json(result);
        })
        // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية جلب بيانات مرسل الطلب
            .catch((err) => res.json(err));
    }
}

function putResetPassword(req, res) {
    // جلب رقم الهاتف
    let mobilePhone = req.params.mobilePhone;
    // في حالة لم يتم إرسال رقم الموبايل فإننا نرجع رسالة خطأ
    if (!mobilePhone) {
        res.json("الرجاء إرسال رقم موبايل !!!");
    } else {
        // إعادة ضبط طلب السر من خلال المسؤول لتصبح نفس رقم الهاتف المُسجل
        const { resetPasswordForUserFromAdmin } = require("../models/admin.model");
        resetPasswordForUserFromAdmin(mobilePhone).then((result) => {
            // إرجاع النتيجة للمستخدم
            res.json(result);
        })
        // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية إعادة ضبط كلمة السر من قبل المسؤول
            .catch((err) => res.json(err));
    }
}

function postAddAds(req, res) {
    // جلب محتوى الإعلان المراد نشره
    let content = req.body.content;
    // في حالة لم يتم إرسال المحتوى فعلياً فإننا نرجع رسالة خطأ
    if (!content) res.json("عذراً لا يوجد محتوى لهذا الإعلان ، الرجاء كتابة محتوى وإرسالها");
    else {
        // في حالة تمّ إرسال محتوى الإعلان فإننا نقوم بحفظ الإعلان في قاعدة البيانات
        const { addAds } = require("../models/ads.model");
        addAds(content).then((result) => {
            // إرجاع النتيجة للمستخدم
            req.json(result);
        })
        // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية حفظ الإعلان في قاعدة البيانات
            .catch((err) => res.json(err));
    }
}

function getAllAds(req, res) {
    // جلب كل الإعلانات
    const { getAllAds } = require("../models/ads.model");
    getAllAds()
        .then((result) => {
            // إعادة النتيجة للمستخدم
            res.json(result);
        })
        // طباعة رسالة الخطأ في حالة حدثت
        .catch((err) => console.log(err));
}

function deleteAds(req, res) {
    // جلب رقم معرّف الإعلان
    let adsId = req.params.adsId;
    // في حالة رقم معرّف الإعلان غير موجود فإننا نرجع رسالة خطأ
    if (!adsId) res.json("عذراً يجب إرسال معرّف الإعلان حتى يتم حذفه");
    else {
        // في حالة الرقم موجود فإننا نقوم بعملية حذف الإعلان من قاعدة البيانات
        const { deleteAds } = require("../models/ads.model");
        deleteAds(adsId)
            .then((result) => {
                // إعادة النتيجة للمستخدم
                res.json(result);
            })
            // إرجاع رسالة خطأ في حالة حدثت مشكلة أثناء عملية حذف الإعلان
            .catch((err) => console.log(err));
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    getAdminLogin,
    getAdminInfo,
    putResetPassword,
    getRequestSenderInfo,
    postAddAds,
    getAllAds,
    deleteAds,
}