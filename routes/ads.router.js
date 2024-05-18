const adsRouter = require("express").Router();

const adsController = require("../controllers/ads.controller");

const { validateJWT } = require("../middlewares/global.middlewares");

adsRouter.post("/add-ad", validateJWT, adsController.postAddAd);

adsRouter.get("/all-ads", adsController.getAllAds);

adsRouter.delete("/:adId", validateJWT, adsController.deleteAd);

module.exports = adsRouter;