// Import Mongoose

const mongoose = require("mongoose");

// Create User Schema

const requestSchema = mongoose.Schema({
    requestType: String,
    serviceType: String,
    newAddress: String,
    imageOfTheBrokenTool: String,
    pictureOfTheVacationSpot: String,
    preferredDateOfVisit: String,
    preferredTimeOfVisit: String,
    electricityTimes: String,
    isAlternativeEnergyExist: String,
    userId: String,
});

// Create Request Model From Request Schema

const requestModel = mongoose.model("request", requestSchema);

// Import Database URL

const DB_URL = require("../global/DB_URL");

async function createNewRequest(requestInfo) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Save The New Request As Document In Request Collection
        let newRequest = new requestModel(requestInfo);
        await newRequest.save();
        // Disconnect In DB
        await mongoose.disconnect();
        return "تمّ طلب الخدمة بنجاح ، سوف يتم التواصل معك قريباً جداً";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً حدث خطأ ، الرجاء إعادة العملية");
    }
}

async function getAllRequests() {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Get All Requests
        let allRequests = await requestModel.find({});
        if (allRequests.length > 0) {
            // Disconnect In DB
            await mongoose.disconnect();
            return allRequests;
        } else {

        }
        // Disconnect In DB
        await mongoose.disconnect();
        return "تمّ طلب الخدمة بنجاح ، سوف يتم التواصل معك قريباً جداً";
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً حدث خطأ ، الرجاء إعادة العملية");
    }
}

module.exports = {
    createNewRequest,
    getAllRequests,
}