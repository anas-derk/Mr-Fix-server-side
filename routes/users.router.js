const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const {
    validateJWT,
    validateEmail,
    validatePassword,
    validateIsEmailOrMobilePhone,
    validateMobilePhone,
    validateGender,
    validateCity
} = require("../middlewares/global.middlewares");

usersRouter.post("/create-new-user",
    async (req, res, next) => {
        const userInfo = req.body;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "First And Last Name", fieldValue: userInfo.firstAndLastName, dataType: "string", isRequiredValue: true },
            { fieldName: "Email", fieldValue: userInfo.email, dataType: "string", isRequiredValue: false },
            { fieldName: "Mobile Phone", fieldValue: userInfo.mobilePhone, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: userInfo.password, dataType: "string", isRequiredValue: true },
            { fieldName: "Gender", fieldValue: userInfo.gender, dataType: "string", isRequiredValue: true },
            { fieldName: "Birthday", fieldValue: userInfo.birthday, dataType: "string", isRequiredValue: true },
            { fieldName: "City", fieldValue: userInfo.city, dataType: "string", isRequiredValue: true },
            { fieldName: "Address", fieldValue: userInfo.address, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateMobilePhone(req.body.mobilePhone, res, next),
    (req, res, next) => validatePassword(req.body.password, res, next),
    (req, res, next) => validateGender(req.body.gender, res, next),
    (req, res, next) => {
        if (req.body.email) {
            validateEmail(req.body.email, res, next);
        }
    },
    usersController.createNewUser
);

usersRouter.get("/login",
    async (req, res, next) => {
        const emailAndPassword = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Email Or Mobile Phone", fieldValue: emailAndPassword.text, dataType: "string", isRequiredValue: true },
            { fieldName: "Password", fieldValue: emailAndPassword.password, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    (req, res, next) => validateIsEmailOrMobilePhone(req.query.text, res, next),
    (req, res, next) => validatePassword(req.query.password, res, next),
    usersController.login
);

usersRouter.get("/user-info", validateJWT, usersController.getUserInfo);

usersRouter.get("/forget-password", usersController.getForgetPassword);

usersRouter.put("/reset-password/:userId", usersController.putResetPassword);

usersRouter.put("/update-user-info", validateJWT, usersController.putProfile);

module.exports = usersRouter;