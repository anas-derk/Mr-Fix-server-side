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
        let user;
        if (userInfo.email.length === 0) {
            // Check If Mobile Phone It Exist
            user = await userModel.findOne({ mobilePhone: userInfo.mobilePhone });
        } else {
            // Check If Email Or Mobile Phone It Exist
            user = await userModel.findOne({
                $or: [
                    {
                        email: userInfo.email,
                    },
                    {
                        mobilePhone: userInfo.mobilePhone,
                    }
                ]
            });
        }
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

async function isUserAccountExist(email) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If User Is Exist
        let user = await userModel.findOne({ email });
        await mongoose.disconnect();
        if (user) return user._id;
        return false;
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
    }
}

async function login(text, password) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        // Check If Email Is Exist
        let user = await userModel.findOne({
            $or: [
                {
                    email: text
                },
                {
                    mobilePhone: text
                }
            ]
        });
        if (user) {
            // Check From Password
            let isTruePassword = await bcrypt.compare(password, user.password);
            await mongoose.disconnect();
            if (isTruePassword) return user._id;
            return "عذراً ، الإيميل أو رقم الهاتف خاطئ أو كلمة السر خاطئة";
        }
        else {
            mongoose.disconnect();
            return "عذراً ، الإيميل أو رقم الهاتف خاطئ أو كلمة السر خاطئة";
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
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
        return "عذراً ، المستخدم غير موجود";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
    }
}

async function updateProfile(userId, newUserData, isSameOfEmail, isSameOfMobilePhone) {
    try {
        // Connect To DB
        await mongoose.connect(DB_URL);
        let user;
        if (isSameOfEmail === "no" && isSameOfMobilePhone == "yes") {
            user = await userModel.findOne({ email: newUserData.email });
            // Check If User Is Exist
            if (user) {
                await mongoose.disconnect();
                return "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!";
            } else {
                let newEncryptedPassword = await bcrypt.hash(newUserData.password, 10);
                await userModel.updateOne({ _id: userId }, {
                    firstAndLastName: newUserData.firstAndLastName,
                    email: newUserData.email.toLowerCase(),
                    password: newEncryptedPassword,
                    gender: newUserData.gender,
                    birthday: newUserData.birthday,
                    city: newUserData.city,
                    address: newUserData.address,
                });
                await mongoose.disconnect();
            }
        } else if (isSameOfEmail == "yes" && isSameOfMobilePhone == "no") {
            user = await userModel.findOne({ mobilePhone: newUserData.mobilePhone });
            // Check If User Is Exist
            if (user) {
                await mongoose.disconnect();
                return "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!";
            } else {
                let newEncryptedPassword = await bcrypt.hash(newUserData.password, 10);
                await userModel.updateOne({ _id: userId }, {
                    firstAndLastName: newUserData.firstAndLastName,
                    mobilePhone: newUserData.mobilePhone,
                    password: newEncryptedPassword,
                    gender: newUserData.gender,
                    birthday: newUserData.birthday,
                    city: newUserData.city,
                    address: newUserData.address,
                });
                await mongoose.disconnect();
            }
        } else if (isSameOfEmail == "no" && isSameOfMobilePhone == "no") {
            user = await userModel.findOne({
                $or: [
                    {
                        email: newUserData.email
                    },
                    {
                        mobilePhone: newUserData.mobilePhone,
                    }
                ]
            });
            if (user) {
                await mongoose.disconnect();
                return "عذراً لا يمكن تعديل بيانات الملف الشخصي لأن البريد الإلكتروني أو رقم الموبايل موجود مسبقاً !!";
            } else {
                let newEncryptedPassword = await bcrypt.hash(newUserData.password, 10);
                await userModel.updateOne({ _id: userId }, {
                    firstAndLastName: newUserData.firstAndLastName,
                    email: newUserData.email,
                    mobilePhone: newUserData.mobilePhone,
                    password: newEncryptedPassword,
                    gender: newUserData.gender,
                    birthday: newUserData.birthday,
                    city: newUserData.city,
                    address: newUserData.address,
                });
                await mongoose.disconnect();
            }
        } else {
            let newEncryptedPassword = await bcrypt.hash(newUserData.password, 10);
            await userModel.updateOne({ _id: userId }, {
                firstAndLastName: newUserData.firstAndLastName,
                password: newEncryptedPassword,
                gender: newUserData.gender,
                birthday: newUserData.birthday,
                city: newUserData.city,
                address: newUserData.address,
            });
            await mongoose.disconnect();
        }
    }
    catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("Sorry, Error In Process, Please Repeated This Process !!");
    }
}

// دالة لإعادة تعيين كلمة السر
async function resetUserPassword(userId, newPassword) {
    try {
        await mongoose.connect(DB_URL);
        let newEncryptedPassword = await bcrypt.hash(newPassword, 10);
        await userModel.updateOne({ _id: userId }, { password: newEncryptedPassword });
        return "لقد تمّت عملية إعادة تعيين كلمة المرور الخاصة بك بنجاح !!";
    } catch (err) {
        // Disconnect In DB
        await mongoose.disconnect();
        throw Error("عذراً يوجد مشكلة ، الرجاء إعادة المحاولة !!");
    }
}

module.exports = {
    createNewUser,
    login,
    getUserInfo,
    updateProfile,
    isUserAccountExist,
    resetUserPassword,
    userModel,
}