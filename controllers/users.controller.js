function createNewUser(req, res) {
    let firstAndLastName = req.body.firstAndLastName,
        email = req.body.email,
        mobilePhone = req.body.mobilePhone,
        password = req.body.password,
        gender = req.body.gender,
        birthday = req.body.birthday,
        city = req.body.city,
        address = req.body.address;
    // Start Handle Email Value To Check It Before Save In DB
    const { isEmail } = require("../global/functions");
    // Check If Email, Password And Name Are Exist
    if (firstAndLastName.length > 0 && mobilePhone.length > 0
        && password.length > 0 && gender.length > 0 && birthday.length > 0
        && city.length > 0 && address.length > 0) {
        if (email.length > 0) {
            // Check If Email Valid
            if (isEmail(email)) {
                const { createNewUser } = require("../models/users.model");
                // Create New User
                createNewUser(req.body).then((msg) => {
                    res.json(msg);
                })
                    .catch((err) => res.json(err));
            }
            else {
                // Return Error Msg If Email Is Not Valid
                res.status(500).json("Error, This Is Not Email Valid !!");
            }
        } else {
            const { createNewUser } = require("../models/users.model");
            // Create New User
            createNewUser(req.body).then((msg) => {
                res.json(msg);
            })
                .catch((err) => res.json(err));
        }
    }
}

function getForgetPassword(req, res) {
    const email = req.query.email;
    if (email) {
        // Start Handle Email Value To Check It Before Save In DB
        const { isEmail } = require("../global/functions");
        // Check If Email Valid
        if (isEmail(email)) {
            const { isUserAccountExist } = require("../models/users.model");
            // Check If User Is Exist
            isUserAccountExist(email).then((userId) => {
                // If User Is Exist => Send Code To This Email
                if (userId) {
                    // إذا كان الحساب موجوداً نقوم بإرسال الإيميل
                    const { sendCodeToUserEmail } = require("../global/functions");
                    sendCodeToUserEmail(email)
                        .then(generatedCode => {
                            // إرجاع البيانات المطلوبة لعملية إعادة ضبط كلمة السر
                            res.json(
                                {
                                    userId,
                                    code: generatedCode[0],
                                }
                            );
                        })
                        .catch(err => res.json(err));
                } else {
                    res.json("عذراً البريد الالكتروني الذي أدخلته غير موجود !!");
                }
            })
                .catch((err) => res.json(err));
        }
        else {
            // Return Error Msg If Email Is Not Valid
            res.status(500).json("عذراً ، الإيميل الذي أدخلته غير صالح !!!");
        }
    }
    else {
        res.status(500).json("الرجاء إرسال الإيميل المطلوب لاستعادة كلمة السر الخاصة به");
    }
}

function login(req, res) {
    let text = req.query.text,
        password = req.query.password;
    // Start Handle Email Value To Check It Before Save In DB
    const { isEmail, isNumber } = require("../global/functions");
    // Check If Email And Password Are Exist
    if (text.length > 0 && password.length > 0) {
        // Check If Email Valid Or Mobile Phone Valid
        if (isEmail(text) || isNumber(text)) {
            const { login } = require("../models/users.model");
            login(text, password).then((result) => {
                res.json(result);
            })
                .catch((err) => res.json(err));
        } else {
            // Return Error Msg If Email Is Not Valid
            res.status(500).json("Error, This Is Not Email Valid !!");
        }
    } else {
        res.status(500).json("Error, Please Enter Email And Password Or Rest Input !!");
    }
}

function getUserInfo(req, res) {
    // Get User Id
    let userId = req.params.userId;
    // Check If User Id Is Exist
    if (!userId) res.status(500).json("Sorry, Please Send User Id !!");
    else {
        // Get User Info Because User Id Is Exist
        const { getUserInfo } = require("../models/users.model");
        getUserInfo(userId).then((result) => {
            res.json(result);
        })
            .catch((err) => res.json(err));
    }
}

function putProfile(req, res) {
    // Get User Id
    let userId = req.params.userId,
        newUserData = req.body,
        isSameOfEmail = req.query.isSameOfEmail;
        isSameOfMobilePhone = req.query.isSameOfMobilePhone;
    // Check If User Id Is Exist
    if (!userId) res.status(500).json("Sorry, Please Send User Id !!");
    else {
        // Get User Info Because User Id Is Exist
        const { updateProfile } = require("../models/users.model");
        updateProfile(userId, newUserData, isSameOfEmail, isSameOfMobilePhone).then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err));
    }
}

function putResetPassword(req, res) {
    // Get User Id
    let userId = req.params.userId;
    // Check If User Id Is Exist
    if (!userId) res.status(500).json("عذراً الرجاءإرسال معرّف مستخدم !!");
    else {
        // Get Reset User Password Because User Id Is Exist
        let newPassword = req.query.newPassword;
        const { resetUserPassword } = require("../models/users.model");
        resetUserPassword(userId, newPassword).then((result) => {
            res.json(result);
        })
            .catch((err) => res.json(err));
    }
}

module.exports = {
    createNewUser,
    login,
    getUserInfo,
    putProfile,
    getForgetPassword,
    putResetPassword,
}