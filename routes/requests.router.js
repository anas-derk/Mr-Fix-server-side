const requestsRouter = require("express").Router();

const requestsController = require("../controllers/requests.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const upload = require("../global/multer.config");

requestsRouter.post("/create-new-request",
    validateJWT,
    upload.any(),
    async (req, res, next) => {
        const requestInfo = {
            ...Object.assign({}, req.body),
            files: req.files,
        };
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Request Type", fieldValue: requestInfo.requestType, dataType: "string", isRequiredValue: true },
            { fieldName: "Service Type", fieldValue: requestInfo.serviceType, dataType: "string", isRequiredValue: true },
            { fieldName: "Explain And New Address", fieldValue: requestInfo.explainAndNewAddress, dataType: "string", isRequiredValue: true },
            { fieldName: "Preferred Date Of Visit", fieldValue: requestInfo.preferredDateOfVisit, dataType: "string", isRequiredValue: true },
            { fieldName: "Preferred Time Of Visit", fieldValue: requestInfo.preferredTimeOfVisit, dataType: "string", isRequiredValue: false },
            { fieldName: "Preferred Time Of Visit", fieldValue: requestInfo.preferredTimeOfVisit, dataType: "string", isRequiredValue: false },
            { fieldName: "Electricity Times", fieldValue: requestInfo.electricityTimes, dataType: "string", isRequiredValue: true },
            { fieldName: "Is Alternative Energy Exist", fieldValue: requestInfo.isAlternativeEnergyExist, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    requestsController.postServiceRequest
);

requestsRouter.get("/all-requests", validateJWT, requestsController.getAllRequests);

module.exports = requestsRouter;