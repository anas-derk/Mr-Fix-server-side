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
            { fieldName: "Electricity Times", fieldValue: requestInfo.electricityTimes, dataType: "string", isRequiredValue: true },
            { fieldName: "Is Alternative Energy Exist", fieldValue: requestInfo.isAlternativeEnergyExist, dataType: "string", isRequiredValue: true },
        ], res, next);
    },
    requestsController.postServiceRequest
);

requestsRouter.get("/requests-count", validateJWT, requestsController.getRequestsCount);

requestsRouter.get("/all-requests-inside-the-page",
    validateJWT,
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    requestsController.getAllRequestsInsideThePage
);

requestsRouter.get("/request-sender-info",
    validateJWT,
    async (req, res, next) => {
        const requestAndUserIds = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Request Id", fieldValue: requestAndUserIds.requestId, dataType: "ObjectId", isRequiredValue: true },
            { fieldName: "User Id", fieldValue: requestAndUserIds.userId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    requestsController.getRequestSenderInfo
);

module.exports = requestsRouter;