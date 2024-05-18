const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

adsRouter.post("/add-ad", adsController.postAddAd);

adsRouter.get("/all-ads", adsController.getAllAds);

adsRouter.delete("/:adId", adsController.deleteAd);

module.exports = adsRouter;