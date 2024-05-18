// استيراد كائن ال mongoose + requestModel

const { requestModel } = require("./all.models");

async function createNewRequest(requestInfo) {
    try {
        // إنشاء طلب جديد وحفظه في قاعدة البيانات ضمن جدول الطلبات
        const newRequest = new requestModel(requestInfo);
        // الاحتفاظ بمعلومات الطلب كاملة للاستفادة منها لاحقاً في إرسالها كرسالة على إيميل المسؤول
        const fullRequestInfo = await newRequest.save();
        // البحث في جدول المستخدمين عن المستخدم الذي أرسل الطلب
        const requestSenderInfo = await mongoose.models.user.findById(requestInfo.userId);
        // تجميع بيانات الطلب + بيانات مرسل الطلب ضمن مصفوفة للاستفادة منها لاحقاً كما ذكرت
        return [fullRequestInfo, requestSenderInfo];
    }
    catch (err) {
        // في حالة حدث خطأ أثناء العملية ، نرمي استثناء بالخطأ
        throw Error(err);
    }
}

async function getAllRequests() {
    try {
        // الاتصال بقاعدة البيانات
        await mongoose.connect(DB_URL);
        // جلب كل بيانات الطلبات من جدول الطلبات مع ترتيبها تنازلياً
        const requests = await requestModel.find({}).sort({ requestPostDate: -1 });
        if (requests) {
            return requests;
        } else {
            return "عذراً لا توجد أي طلبات حالياً";
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