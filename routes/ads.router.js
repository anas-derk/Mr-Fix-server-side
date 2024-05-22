const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

adsRouter.post("/add-ad", validateJWT, adsController.postAddAd);

adsRouter.get("/ads-count", adsController.getAdsCount);

adsRouter.get("/all-ads-inside-the-page", adsController.getAllAdsInsideThePage);

adsRouter.delete("/:adId", validateJWT, adsController.deleteAd);

module.exports = adsRouter;