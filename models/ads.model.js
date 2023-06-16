// استيراد الملف الذي يحتوي رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

// استيراد كائن ال mongoose + adsModel

const { mongoose, adsModel } = require("./all.models");

async function addAds(content) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث في جدول الإعلانات عن إعلان له نفس المحتوى تماماً
        let ads = await adsModel.findOne({ content });
        // في حالة كان يوجد إعلان مطابق فإننا نعيد رسالة خطأ
        if (ads) {
            mongoose.disconnect();
            return "عذراً يوجد إعلان سابق بنفس المحتوى تماماً";
        }
        else {
            // في حالة لم يكن يوجد إعلان مطابق فإننا ننشأ إعلان
            let newAds = new adsModel({
                content
            });
            // حفظ الإعلان في قاعدة البيانات
            await newAds.save();
            // في حالة نجاح العملية فأننا نقطع الاتصال بقاعدة البيانات ونعيد رسالة نجاح
            mongoose.disconnect();
            return "تهانينا ، لقد تمّ إضافة الإعلان بنجاح";
        }
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function getAllAds() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل بيانات الإعلانات من جدول الإعلانات بترتيب تنازلي
        const adsList = await adsModel.find({}).sort({ adsPostDate: -1 });
        // قطع الاتصال بقاعدة البيانات وإعادة بيانات الإعلانات
        mongoose.disconnect();
        return adsList;
    } catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

async function deleteAds(adsId) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // البحث عن إعلان له نفس رقم المعرّف وحذفه
        await adsModel.deleteOne({ _id: adsId });
        // إرجاع رسالة نجاح العملية
        return "تم حذف الإعلان بنجاح";
    }catch(err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        mongoose.disconnect();
        throw Error(err);
    }
}

// تصدير الدوال المعرفة سابقاً
module.exports = {
    addAds,
    getAllAds,
    deleteAds,
}