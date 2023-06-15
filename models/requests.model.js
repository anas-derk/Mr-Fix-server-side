// استيراج مكتبة التعامل مع قواعد البيانات mongo

const mongoose = require("mongoose");

// تعريف كائن هيكل جدول الطلبات

const requestSchema = new mongoose.Schema({
    requestType: String,
    serviceType: String,
    explainAndNewAddress: String,
    preferredDateOfVisit: {
        type: String,
        default: "فوراً",
    },
    preferredTimeOfVisit: {
        type: String,
        default: "فوراً",
    },
    electricityTimes: String,
    isAlternativeEnergyExist: String,
    requestPostDate: {
        type: Date,
        default: Date.now(),
    },
    userId: String,
    files: Array,
});

// إنشاء كائن جدول الطلبات من كائن هيكل الطلبات

const requestModel = mongoose.model("request", requestSchema);

// استيراد كائن جدول المستخدمين

const { userModel } = require("./users.model");

// استيراد الملف الذي يحتوي على رابط قاعدة البيانات

const DB_URL = require("../global/DB_URL");

async function createNewRequest(requestInfo) {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // إنشاء طلب جديد وحفظه في قاعدة البيانات ضمن جدول الطلبات
        const newRequest = new requestModel(requestInfo);
        // الاحتفاظ بمعلومات الطلب كاملة للاستفادة منها لاحقاً في إرسالها كرسالة على إيميل المسؤول
        const fullRequestInfo = await newRequest.save();
        // البحث في جدول المستخدمين عن المستخدم الذي أرسل الطلب
        const requestSenderInfo = await userModel.findById(requestInfo.userId);
        // قطع الاتصال بقاعدة البيانات
        await mongoose.disconnect();
        // تجميع بيانات الطلب + بيانات مرسل الطلب ضمن مصفوفة للاستفادة منها لاحقاً كما ذكرت
        return [fullRequestInfo, requestSenderInfo];
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error("عذراً حدث خطأ ، الرجاء إعادة العملية");
    }
}

async function getAllRequests() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل بيانات الطلبات من جدول الطلبات مع ترتيبها تنازلياً
        let requests = await requestModel.find({}).sort({ requestPostDate: -1 });
        if (requests) {
            // إذا كان يوجد طلبات بالتالي إعادتها للمستخدم وقطع الاتصال بقاعدة البيانات
            await mongoose.disconnect();
            return requests;
        } else {
            // في حالة لم يكن هنالك طلبات ، بالتالي إعادة رسالة خطأ للمستخدم
            await mongoose.disconnect();
            return "عذراً لا توجد أي طلبات حالياً";
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نقطع الاتصال ونرمي استثناء بالخطأ
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
    }
}

module.exports = {
    createNewRequest,
    getAllRequests,
    requestModel,
}