const { getResponseObject } = require("../global/functions");

const requestsOPerationsManagmentFunctions = require("../models/requests.model");

const { sendEmail } = require("../global/functions");

async function postServiceRequest(req, res) {
    try{
        const uploadError = req.uploadError;
        if (uploadError) {
            res.status(400).json(getResponseObject(uploadError, true, {}));
            return;
        }
        // تعريف مصفوفة صور الطلب 
        let requestImages = [];
        // عمل حلقة تكرارية لإضافة كل مسارات الصور التي تمّ رفعها إليها
        for(let file of req.files) {
            requestImages.push(file.path);
        }
        // إنشاء طلب جديد
        const result = await requestsOPerationsManagmentFunctions.createNewRequest(req.data._id, {
            ...Object.assign({}, req.body),
            files: requestImages,
        });
        res.json({
            msg: "تمّ طلب الخدمة بنجاح ، سوف يتم التواصل معك قريباً جداً",
            error: false,
            data: {},
        });
        // في حالة نجاح عملية إنشاء الطلب عندها نرسل إيميل للمسؤول
        sendEmail(result.data);
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getRequestsCount(req, res) {
    try {
        res.json(await requestsOPerationsManagmentFunctions.getRequestsCount());
    }
    catch (err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

async function getAllRequestsInsideThePage(req, res) {
    try{
        const filters = req.query;
        res.json(await requestsOPerationsManagmentFunctions.getAllRequestsInsideThePage(filters.pageNumber, filters.pageSize));
    }
    catch(err) {
        res.status(500).json(getResponseObject("Internal Server Error !!", true, {}));
    }
}

// تصدير الدوال المعرّفة
module.exports = {
    postServiceRequest,
    getRequestsCount,
    getAllRequestsInsideThePage
}