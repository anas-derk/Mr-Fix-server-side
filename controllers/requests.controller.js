function postServiceRequest(req, res) {
    // تعريف مصفوفة صور الطلب 
    let requestImages = [];
    // عمل حلقة تكرارية لإضافة كل مسارات الصور التي تمّ رفعها إليها
    for(let file of req.files) {
        requestImages.push(file.path);
    }
    // تجميع بيانات الطلب بحيث يتم وضع بيانات الطلب مع مسارات الملفات ضمن كائن واحد مع مراعاة أن يكون ليس هنالك صور قد تمّ رفعها
    const requestInfo = {
        ...Object.assign({}, req.body),
        files: requestImages,
    };
    // إنشاء طلب جديد
    const { createNewRequest } = require("../models/requests.model");
    createNewRequest(requestInfo).then((result) => {
        // في حالة نجاح عملية إنشاء الطلب عندها نرسل إيميل للمسؤول
        res.json("تمّ طلب الخدمة بنجاح ، سوف يتم التواصل معك قريباً جداً");
        const { sendEmail } = require("../global/functions");
        sendEmail(result);
    })
    .catch((err) => {
        // في حالة حدث خطأ أثناء العملية عندها نحذف الملفات التي تمّ رفعها لكي لا يتم إستهلاك المساحة التخزينية للسيرفر
        const { unlinkSync } = require("fs");
        for (let file of requestImages.files) {
            unlinkSync(file.path);
        }
        console.log(err);
        // إعادة رسالة الخطأ للمستخدم
        res.json(err);
    });
}

function getAllRequests(req, res) {
    // جلب كل الطلبات
    const { getAllRequests } = require("../models/requests.model");
    getAllRequests().then((result) => {
        // إعادة النتيجة للمستخدم كاستجابة من السيرفر
        res.json(result);
    })
    .catch((err) => res.json(err));
}

// تصدير الدوال المعرّفة
module.exports = {
    postServiceRequest,
    getAllRequests,
}