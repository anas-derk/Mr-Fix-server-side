const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

const { validateIsExistValueForFieldsAndDataTypes } = require("../global/functions");

const { validateJWT } = require("../middlewares/global.middlewares");

adsRouter.post("/add-new-ad", validateJWT, adsController.postAddAd);

adsRouter.get("/ads-count", adsController.getAdsCount);

adsRouter.get("/all-ads-inside-the-page",
    async (req, res, next) => {
        const filters = req.query;
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "page Number", fieldValue: Number(filters.pageNumber), dataType: "number", isRequiredValue: true },
            { fieldName: "page Size", fieldValue: Number(filters.pageSize), dataType: "number", isRequiredValue: true },
        ], res, next);
    },
    adsController.getAllAdsInsideThePage
);

adsRouter.delete("/:adId",
    validateJWT,
    async (req, res, next) => {
        validateIsExistValueForFieldsAndDataTypes([
            { fieldName: "Ad Id", fieldValue: req.params.adId, dataType: "ObjectId", isRequiredValue: true },
        ], res, next);
    },
    adsController.deleteAd
);

module.exports = adsRouter;