const { getResponseObject, isEmail, isValidPassword } = require("../global/functions");
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
    keyGeneratorForRequestsRateLimit,
}