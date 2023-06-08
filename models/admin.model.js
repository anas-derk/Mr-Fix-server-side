// import mongoose module for manipulate with mongo database

const mongoose = require("mongoose");

// import Database Url

const DB_URL = require("../global/DB_URL");

// create Admin User Schema For Admin User Model

const adminSchema = mongoose.Schema({
    email: String,
    password: String,
});

// create Admin User Model In Database

const adminModel = mongoose.model("admin", adminSchema);

// import User Model And Request Model

const { requestModel } = require("./requests.model");

const { userModel } = require("./users.model");

// import bcryptjs module for password encrypting

const bcrypt = require("bcryptjs");

// define admin login function

async function adminLogin(email, password) {
    await mongoose.connect(DB_URL);
    let adminData = await adminModel.findOne({ email });
    if (!adminData) {
        await mongoose.disconnect();
        return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
    } else {
        let isTruePassword = bcrypt.compare(password, adminData.password);
        if (isTruePassword) {
            await mongoose.disconnect();
            return adminData._id;
        } else {
            await mongoose.disconnect();
            return "عذراً البريد الالكتروني أو كلمة السر خاطئة ...";
        }
    }
}

async function getAdminInfo(adminId) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If User Is Exist
        let admin = await adminModel.findById(adminId);
        await mongoose.disconnect();
        if (admin) return admin;
        return "عذراً ، حساب المسؤول غير موجود";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً توجد مشكلة ، الرجاء إعادة العملية !!!");
    }
}

async function getRequestSenderInfo(requestId, userId) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If User Is Exist
        let request = await requestModel.findById(requestId);
        if (!request) {
            await mongoose.disconnect();
            return "عذراً ، لا يوجد طلب بهذا المعرّف !!!";
        } else {
            let user = await userModel.findById(userId);
            return user;
        }
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً توجد مشكلة ، الرجاء إعادة العملية !!!");
    }
}

async function resetPasswordForUserFromAdmin(mobilePhone) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If User Is Exist
        let user = await mongoose.models.user.findOne({ mobilePhone });
        if (!user) {
            await mongoose.disconnect();
            return "عذراً ، الحساب غير موجود";
        } else {
            let newEncryptedPassword = await bcrypt.hash(mobilePhone, 10);
            await mongoose.models.user.updateOne({ mobilePhone }, {
                password: newEncryptedPassword,
            });
            return "تهانينا ، لقد تمّ إعادة تعيين كلمة السر لتصبح على نفس رقم الموبايل";
        }
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً توجد مشكلة ، الرجاء إعادة العملية !!!");
    }
}

module.exports = {
    adminLogin,
    getAdminInfo,
    resetPasswordForUserFromAdmin,
    getRequestSenderInfo,
}