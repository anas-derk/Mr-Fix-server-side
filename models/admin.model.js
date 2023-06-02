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

// require bcryptjs module for password encrypting

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

module.exports = {
    adminLogin,
    getAdminInfo,
}