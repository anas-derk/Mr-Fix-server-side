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
    if (firstAndLastName.length > 0 && email.length > 0 && mobilePhone.length > 0
        && password.length > 0 && gender.length > 0 && birthday.length > 0
        && city.length > 0 && address.length > 0) {
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
        res.status(500).json("Error, Please Enter Email And Password Or Rest Input !!");
    }
}

function login(req, res) {
    let text = req.query.text,
        password = req.query.password;
    // Start Handle Email Value To Check It Before Save In DB
    const { isEmail } = require("../global/functions");
    // Check If Email And Password Are Exist
    if (text.length > 0 && password.length > 0) {
        // Check If Email Valid
        if (isEmail(text)) {
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
        newUserData = req.body;
    console.log(newUserData);
    // Check If User Id Is Exist
    if (!userId) res.status(500).json("Sorry, Please Send User Id !!");
    else {
        // Get User Info Because User Id Is Exist
        const { updateProfile } = require("../models/users.model");
        updateProfile(userId, newUserData).then((result) => {
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
}