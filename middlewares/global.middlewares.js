const { getResponseObject, isEmail, isValidPassword, isValidMobilePhone } = require("../global/functions");
const { verify } = require("jsonwebtoken");

function validateJWT(req, res, next) {
    const token = req.headers.authorization;
    verify(token, process.env.secretKey, async (err, decode) => {
        if (err) {
            res.status(401).json(getResponseObject("Unauthorized Error", true, {}));
            return;
        }
        req.data = decode;
        next();
    });
}

function validateEmail(email, res, nextFunc) {
    if (!isEmail(email)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Email !!", true, {}));
        return;
    }
    nextFunc();
}

function validatePassword(password, res, nextFunc) {
    if (!isValidPassword(password)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Password !!", true, {}));
        return;
    }
    nextFunc();
}

function validateCode(code, res, nextFunc) {
    if (code.length !== 4) {
        res.status(400).json(getResponseObject("Please Send Valid Code !!", true, {}));
        return;
    }
    nextFunc();
}

function validateMobilePhone(mobilePhone, res, nextFunc) {
    if (!isValidMobilePhone(mobilePhone)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Mobile Phone !!", true, {}));
        return;
    }
    nextFunc();
}

function validateIsEmailOrMobilePhone(text, res, nextFunc) {
    if (!isEmail(text) && !isValidMobilePhone(text)) {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Email Or Mobile Phone !!", true, {}));
        return;
    }
    nextFunc();
}

function validateGender(gender, res, nextFunc) {
    if (gender !== "male" || gender !== "female") {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid Gender !!", true, {}));
        return;
    }
    nextFunc();
}

function validateCity(city, res, nextFunc) {
    if (city !== "damascus" || gender !== "rif-damascus") {
        res.status(400).json(getResponseObject("Sorry, Please Send Valid City !!", true, {}));
        return;
    }
    nextFunc();
}

function keyGeneratorForRequestsRateLimit(req) {
    const ipAddress = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const ipWithoutPort = ipAddress.split(',')[0];
    return ipWithoutPort;
}

module.exports = {
    validateJWT,
    validateEmail,
    validatePassword,
    validateCode,
    validateMobilePhone,
    validateIsEmailOrMobilePhone,
    validateGender,
    validateCity,
    keyGeneratorForRequestsRateLimit,
}