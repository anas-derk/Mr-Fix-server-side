// استيراد كائن ال mongoose + requestModel

const { requestModel, userModel } = require("./all.models");

async function createNewRequest(requestInfo) {
    try {
        // إنشاء طلب جديد وحفظه في قاعدة البيانات ضمن جدول الطلبات
        const newRequest = new requestModel(requestInfo);
        // الاحتفاظ بمعلومات الطلب كاملة للاستفادة منها لاحقاً في إرسالها كرسالة على إيميل المسؤول
        const fullRequestInfo = await newRequest.save();
        // البحث في جدول المستخدمين عن المستخدم الذي أرسل الطلب
        const requestSenderInfo = await userModel.findById(requestInfo.userId);
        // تجميع بيانات الطلب + بيانات مرسل الطلب ضمن مصفوفة للاستفادة منها لاحقاً كما ذكرت
        return {
            msg: "عملية إنشاء طلب جديد تمت بنجاح !!",
            error: false,
            data: [fullRequestInfo, requestSenderInfo]
        }
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getAllRequests() {
    try {
        // جلب كل بيانات الطلبات من جدول الطلبات مع ترتيبها تنازلياً
        return {
            msg: "عملية جلب بيانات كل الطلبات تمت بنجاخ !!",
            error: false,
            data: await requestModel.find({}).sort({ requestPostDate: -1 })
        }
    } catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

// تصدير الدوال المعرّفة سابقاً وكائن الطلب
module.exports = {
    createNewRequest,
    getAllRequests,
}