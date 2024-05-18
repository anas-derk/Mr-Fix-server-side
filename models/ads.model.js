// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + adsModel

const { mongoose, adsModel } = require("./all.models");

async function addAds(content) {
    try {
        // البحث في جدول الإعلانات عن إعلان له نفس المحتوى تماماً
        const ads = await adsModel.findOne({ content });
        // في حالة كان يوجد إعلان مطابق فإننا نعيد رسالة خطأ
        if (ads) {
            return "عذراً يوجد إعلان سابق بنفس المحتوى تماماً";
        }
        else {
            // في حالة لم يكن يوجد إعلان مطابق فإننا ننشأ إعلان
            const newAds = new adsModel({
                content
            });
            // حفظ الإعلان في قاعدة البيانات
            await newAds.save();
            return "تهانينا ، لقد تمّ إضافة الإعلان بنجاح";
        }
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getAllAds() {
    try {
        // جلب كل بيانات الإعلانات من جدول الإعلانات بترتيب تنازلي
        const adsList = await adsModel.find({}).sort({ adsPostDate: -1 });
        // إعادة بيانات الإعلانات
        return adsList;
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function deleteAds(adsId) {
    try {
        // البحث عن إعلان له نفس رقم المعرّف وحذفه
        await adsModel.deleteOne({ _id: adsId });
        // إرجاع رسالة نجاح العملية
        return "تم حذف الإعلان بنجاح";
    }catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    addAds,
    getAllAds,
    deleteAds,
}