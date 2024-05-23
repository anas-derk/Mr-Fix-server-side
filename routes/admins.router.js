const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { validateJWT, validateEmail, validatePassword, validateMobilePhone } = require("../middlewares/global.middlewares");

adminsRouter.get("/login",
    async (req, res, next) => {
        const emailAndPassword = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email", fieldValue: emailAndPassword.email, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: emailAndPassword.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateEmail(req.query.email, res, next),
    (req, res, next) => validatePassword(req.query.password, res, next),
    adminsController.getAdminLogin
);

adminsRouter.get("/user-info", validateJWT, adminsController.getAdminInfo);

adminsRouter.put("/reset-password/:mobilePhone",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Mobile Phone", fieldValue: req.params.mobilePhone, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateMobilePhone(req.params.mobilePhone, res, next),
    adminsController.putResetPassword
);

module.exports = adminsRouter;