// استيراد كائن ال mongoose + adsModel

const { adsModel, adminModel } = require("./all.models");

async function addNewAd(adminId, adContent) {
    try {
        const admin = await adminModel.findById(adminId);
        if (admin) {
            // البحث في جدول الإعلانات عن إعلان له نفس المحتوى تماماً
            const ads = await adsModel.findOne({ adContent });
            // في حالة كان يوجد إعلان مطابق فإننا نعيد رسالة خطأ
            if (ads) {
                return {
                    msg: "عذراً يوجد إعلان سابق بنفس المحتوى تماماً",
                    error: true,
                    data: {}
                }
            }
            // في حالة لم يكن يوجد إعلان مطابق فإننا ننشأ إعلان
            const newAds = new adsModel({
                content: adContent
            });
            // حفظ الإعلان في قاعدة البيانات
            await newAds.save();
            return {
                msg: "تهانينا ، لقد تمّ إضافة الإعلان بنجاح",
                error: false,
                data: {}
            }
        }
        return {
            msg: "عذراً هذا المسؤول غير موجود !!",
            error: true,
            data: {}
        }
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getAdsCount() {
    try {
        return {
            msg: "عملية جلب عدد الإعلانات تمت بنجاح !!",
            error: false,
            data: await adsModel.countDocuments({}),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllAdsInsideThePage(pageNumber, pageSize) {
    try {
        return {
            msg: `عملية جلب كل الإعلانات في الصفحة : ${pageNumber} تمت بنجاح !!`,
            error: false,
            data: await adsModel.find(filters).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ adsPostDate: -1 }),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function deleteAd(adminId, adId) {
    try {
        const admin = await adminModel.findById(adminId);
        if (admin) {
            // البحث عن إعلان له نفس رقم المعرّف وحذفه
            await adsModel.deleteOne({ _id: adId });
            // إرجاع رسالة نجاح العملية
            return {
                msg: "تم حذف الإعلان بنجاح",
                error: false,
                data: {}
            }
        }
        return {
            msg: "عذراً هذا المسؤول غير موجود !!",
            error: true,
            data: {}
        }
    }catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    addNewAd,
    getAdsCount,
    getAllAdsInsideThePage,
    deleteAd,
}