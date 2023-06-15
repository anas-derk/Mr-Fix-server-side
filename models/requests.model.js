// Import Mongoose

const mongoose = require("mongoose");

// Create User Schema

const requestSchema = mongoose.Schema({
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

// Create Request Model From Request Schema

const requestModel = mongoose.model("request", requestSchema);

// import User Model Model

const { userModel } = require("./users.model");

// Import Database URL

const DB_URL = require("../global/DB_URL");

async function createNewRequest(requestInfo) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Save The New Request As Document In Request Collection
        const newRequest = new requestModel(requestInfo);
        const fullRequestInfo = await newRequest.save();
        const requestSenderInfo = await userModel.findById(requestInfo.userId);
        // Disconnect In DB
        await mongoose.disconnect();
        return [fullRequestInfo, requestSenderInfo];
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً حدث خطأ ، الرجاء إعادة العملية");
    }
}

async function getAllRequests() {
    try {
        await mongoose.connect(DB_URL);
        let requests = await requestModel.find({}).sort({ requestPostDate: -1 });
        if (requests) {
            await mongoose.disconnect();
            return requests;
        } else {
            await mongoose.disconnect();
            return "عذراً لا توجد أي طلبات حالياً";
        }
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
    }
}

module.exports = {
    createNewRequest,
    getAllRequests,
    requestModel,
}