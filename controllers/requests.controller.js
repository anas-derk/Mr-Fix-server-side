const { getResponseObject } = require("../global/functions");

const requestsOPerationsManagmentFunctions = require("../models/requests.model");

const { sendEmail } = require("../global/functions");

function postServiceRequest(req, res) {
    try{
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
        const result = requestsOPerationsManagmentFunctions.createNewRequest(requestInfo);
        res.json({
            msg: "تمّ طلب الخدمة بنجاح ، سوف يتم التواصل معك قريباً جداً",
            error: false,
            data: {},
        });
        // في حالة نجاح عملية إنشاء الطلب عندها نرسل إيميل للمسؤول
        sendEmail(result);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllRequests(req, res) {
    try{
        res.json(await requestsOPerationsManagmentFunctions.getAllRequests());
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

// تصدير الدوال المعرّفة
module.exports = {
    postServiceRequest,
    getAllRequests,
}