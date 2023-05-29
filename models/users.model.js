// Import Mongoose

const mongoose = require("mongoose");

// Create User Schema

const userSchema = mongoose.Schema({
    firstAndLastName: String,
    email: String,
    mobilePhone: String,
    password: String,
    gender: String,
    birthday: String,
    city: String,
    address: String,
});

// Create User Model From User Schema

const userModel = mongoose.model("user", userSchema);

// Import Database URL

const DB_URL = require("../global/DB_URL");

// require bcryptjs module for password encrypting

const bcrypt = require("bcryptjs");

// Define Create New User Function

async function createNewUser(userInfo) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If Email Is Exist
        let user = await userModel.findOne({ email: userInfo.email });
        if (user) {
            await mongoose.disconnect();
            return "عذراً لا يمكن إنشاء الحساب لأنه موجود مسبقاً !!";
        } else {
            // Encrypting The Password
            let encrypted_password = await bcrypt.hash(userInfo.password, 10);
            // Create New Document From User Schema
            let newUser = new userModel({
                firstAndLastName: userInfo.firstAndLastName,
                email: userInfo.email,
                mobilePhone: userInfo.mobilePhone,
                password: encrypted_password,
                gender: userInfo.gender,
                birthday: userInfo.birthday,
                city: userInfo.city,
                address: userInfo.address,
            });
            // Save The New User As Document In User Collection
            await newUser.save();
            // Disconnect In DB
            await mongoose.disconnect();
            return "تم بنجاح إنشاء الحساب";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً حدث خطأ ، الرجاء إعادة العملية");
    }
}

async function login(email, password) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If Email Is Exist
        let user = await userModel.findOne({ email });
        if (user) {
            // Check From Password
            let isTruePassword = await bcrypt.compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user;
            else return "Sorry, Email Or Password Incorrect !!";
        }
        else {
            mongoose.disconnect();
            return "Sorry, Email Or Password Incorrect !!";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("Sorry, Error In Process, Please Repeated This Process !!");
    }
}

async function getUserInfo(userId) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If User Is Exist
        let user = await userModel.findById(userId);
        await mongoose.disconnect();
        if (user) return user;
        return "Sorry, The User Is Not Exist !!, Please Enter Another Email ..";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("Sorry, Error In Process, Please Repeated This Process !!");
    }
}

module.exports = {
    createNewUser,
    login,
    getUserInfo,
}