// استيراد كائن ال adminModel

const { adminModel, requestModel, userModel } = require("./all.models");

// استيراد مكتبة التشفير

const { compare, hash } = require("bcryptjs");

async function adminLogin(email, password) {
    try{
        // البحث في جدول المسؤولين عن إيميل مطابق
        const adminData = await adminModel.findOne({ email });
        // في حالة لم يكن يوجد بيانات لهذا الإيميل نرجج رسالة خطأ
        if (!adminData) {
            return {
                msg: "عذراً البريد الالكتروني أو كلمة السر خاطئة ...",
                error: true,
                data: {},
            }
        }
        // في حالة كانت توجد بيانات لهذا الإيميل نتحقق من كلمة السر هل صحيحية أم لا
        const isTruePassword = await compare(password, adminData.password);
        // في حالة كانت صحيحة نرجع رقم معرّف المسؤول
        if (isTruePassword) {
            return {
                msg: "تم تسجيل الدخول بنجاح !!",
                error: false,
                data: {
                    _id: adminData._id
                }
            };
        }
        // في حالة لم تكن صحيحة نرجع رسالة خطأ
        return {
            msg: "عذراً البريد الالكتروني أو كلمة السر خاطئة ...",
            error: true,
            data: {}
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
        if (admin) {
            return {
                msg: "عملية جلب بيانات المسؤول تمت بنجاح !!",
                error: false,
                data: admin
            }
        }
        // في حالة لم توجد بيانات نُرجع رسالة خطأ
        return {
            msg: "عذراً ، حساب المسؤول غير موجود",
            error: true,
            data: {}
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function resetPasswordForUserFromAdmin(adminId, mobilePhone) {
    try {
        const admin = await adminModel.findById(adminId);
        if (admin) {
            // التحقق من أنّّه يوجد مستخدم له نفس رقم الموبايل في جدول المستخدمين
            const user = await userModel.findOne({ mobilePhone });
            // إذا لم يكن هنالك مستخدم مطابق عندها نرجع رسالة خطأ
            if (!user) {
                return {
                    msg: "عذراً ، الحساب غير موجود",
                    error: true,
                    data: {}
                }
            }
            // قي حالة كان يوجد مستخدم مطابق فإننا نقوم بتشفير رقم الهاتف لجعله هو نفسه كلمة السر
            const newEncryptedPassword = await hash(mobilePhone, 10);
            // تعديل كلمة السر الخاصة بالمستخدم الذي له نفس رقم الموبايل لتصبح نفسها رقم الموبايل
            await userModel.updateOne({ mobilePhone }, {
                password: newEncryptedPassword,
            });
            // في حالة نجاح العملية فإننا نعيد رسالة نجاح
            return {
                msg: "تهانينا ، لقد تمّ إعادة تعيين كلمة السر لتصبح على نفس رقم الموبايل",
                error: false,
                data: {}
            }
        }
        return {
            msg: "عذراً ، حساب المسؤول غير موجود",
            error: true,
            data: {}
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
}