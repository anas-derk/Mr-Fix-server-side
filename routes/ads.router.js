const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

adsRouter.post("/ads/add-ads", adsController.postAddAd);

adsRouter.get("/ads/all-ads", adsController.getAllAds);

adsRouter.delete("/ads/delete-ads/:adsId", adsController.deleteAd);

module.exports = adsRouter;