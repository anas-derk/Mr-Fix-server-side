// استيراد الملف الذي يحتوي على رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + adminModel

const { mongoose, adminModel } = require("./all.models");

// استيراد مكتبة التشفير

const bcrypt = require("bcryptjs");

async function adminLogin(email, password) {
    try{
        // البحث في جدول المسؤولين عن إيميل مطابق
        const adminData = await adminModel.findOne({ email });
        // في حالة لم يكن يوجد بيانات لهذا الإيميل نرجج رسالة خطأ
        if (!adminData) {
            return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
        } else {
            // في حالة كانت توجد بيانات لهذا الإيميل نتحقق من كلمة السر هل صحيحية أم لا
            const isTruePassword = await bcrypt.compare(password, adminData.password);
            // في حالة كانت صحيحة نرجع رقم معرّف المسؤول
            if (isTruePassword) {
                return adminData._id;
            } else {
                // في حالة لم تكن صحيحة نرجع رسالة خطأ
                return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
            }
        }
    }
    catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getAdminInfo(adminId) {
    try {
        // التحقق من أنّ المستخدم موجود عن طريق البحث في جدول المسؤولين عن بيانات رقم معرّف المسؤول
        const admin = await adminModel.findById(adminId);
        // في حالة كانت توجد بيانات لهذا المسؤول عندها نُرجع بياناته
        if (admin) return admin;
        // في حالة لم توجد بيانات نُرجع رسالة خطأ
        return "عذراً ، حساب المسؤول غير موجود";
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getRequestSenderInfo(requestId, userId) {
    try {
        // التحقق من أنّ الطلب موجود عن طريق البحث في جدول الطلبات عن رقم معرّف موجود مسبقاً
        const request = await mongoose.models.request.findById(requestId);
        // في حالة لم يكن هنالك طلب سابق عندها نرجع رسالة خطأ
        if (!request) {
            return "عذراً ، لا يوجد طلب بهذا المعرّف !!!";
        } else {
            // في حالة كان يوجد طلب بهذا المعرّف فأننا نبحث عن مستخدم في جدول المستخدمين له معرّف مطابق للرقم المُرسل
            const user = await mongoose.models.user.findById(userId);
            // نعيد بيانات المستخدم
            return user;
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function resetPasswordForUserFromAdmin(mobilePhone) {
    try {
        // التحقق من أنّّه يوجد مستخدم له نفس رقم الموبايل في جدول المستخدمين
        const user = await mongoose.models.user.findOne({ mobilePhone });
        // إذا لم يكن هنالك مستخدم مطابق عندها نرجع رسالة خطأ
        if (!user) {
            return "عذراً ، الحساب غير موجود";
        } else {
            // قي حالة كان يوجد مستخدم مطابق فإننا نقوم بتشفير رقم الهاتف لجعله هو نفسه كلمة السر
            const newEncryptedPassword = await bcrypt.hash(mobilePhone, 10);
            // تعديل كلمة السر الخاصة بالمستخدم الذي له نفس رقم الموبايل لتصبح نفسها رقم الموبايل
            await mongoose.models.user.updateOne({ mobilePhone }, {
                password: newEncryptedPassword,
            });
            // في حالة نجاح العملية فإننا نعيد رسالة نجاح
            return "تهانينا ، لقد تمّ إعادة تعيين كلمة السر لتصبح على نفس رقم الموبايل";
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

// تصدير الدوال المعرّفة سابقاً
module.exports = {
    adminLogin,
    getAdminInfo,
    resetPasswordForUserFromAdmin,
    getRequestSenderInfo,
}