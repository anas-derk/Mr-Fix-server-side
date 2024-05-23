// استيراد كائن ال mongoose + requestModel

const { requestModel, userModel } = require("./all.models");

async function createNewRequest(userId, requestInfo) {
    try {
        // إنشاء طلب جديد وحفظه في قاعدة البيانات ضمن جدول الطلبات
        const newRequest = new requestModel({
            ...requestInfo,
            userId
        });
        // الاحتفاظ بمعلومات الطلب كاملة للاستفادة منها لاحقاً في إرسالها كرسالة على إيميل المسؤول
        const fullRequestInfo = await newRequest.save();
        // البحث في جدول المستخدمين عن المستخدم الذي أرسل الطلب
        const requestSenderInfo = await userModel.findById(userId);
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

async function getRequestsCount() {
    try {
        return {
            msg: "عملية جلب عدد الطلبات تمت بنجاح !!",
            error: false,
            data: await requestModel.countDocuments({}),
        }
    } catch (err) {
        throw Error(err);
    }
}

async function getAllRequestsInsideThePage(pageNumber, pageSize) {
    try {
        return {
            msg: `عملية جلب كل الطلبات في الصفحة : ${pageNumber} تمت بنجاح !!`,
            error: false,
            data: await requestModel.find({}).skip((pageNumber - 1) * pageSize).limit(pageSize).sort({ adsPostDate: -1 }),
        }
    } catch (err) {
        throw Error(err);
    }
}

// تصدير الدوال المعرّفة سابقاً وكائن الطلب
module.exports = {
    createNewRequest,
    getRequestsCount,
    getAllRequestsInsideThePage
}