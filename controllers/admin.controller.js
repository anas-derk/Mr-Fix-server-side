function getAdminLogin(req, res) {
    let email = req.query.email,
        password = req.query.password;
    // Start Handle Email Value To Check It Before Save In DB
    const { isEmail } = require("../global/functions");
    // Check If Email And Password Are Exist
    if (email.length > 0 && password.length > 0) {
        // Check If Email Valid
        if (isEmail(email)) {
            const { adminLogin } = require("../models/admin.model");
            adminLogin(email, password).then((result) => {
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

function getAdminInfo(req, res) {
    let adminId = req.params.adminId;
    if (!adminId) {
        res.json("الرجاء إرسال معرّف للمسؤول !!!");
    } else {
        // Get User Info Because User Id Is Exist
        const { getAdminInfo } = require("../models/admin.model");
        getAdminInfo(adminId).then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err));
    }
}

function putResetPassword(req, res) {
    let mobilePhone = req.params.mobilePhone;
    console.log(mobilePhone, typeof mobilePhone);
    if (!mobilePhone) {
        res.json("الرجاء إرسال رقم موبايل !!!");
    } else {
        // Get User Info Because User Id Is Exist
        const { resetPasswordForUserFromAdmin } = require("../models/admin.model");
        resetPasswordForUserFromAdmin(mobilePhone).then((result) => {
            res.json(result);
        })
        .catch((err) => res.json(err));
    }
}

module.exports = {
    getAdminLogin,
    getAdminInfo,
    putResetPassword,
}