const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

adminsRouter.get("/login", adminsController.getAdminLogin);

adminsRouter.get("/admin-info/:adminId", adminsController.getAdminInfo);

adminsRouter.get("/requests/:requestId/users/:userId", adminsController.getRequestSenderInfo);

adminsRouter.put("/reset-password/:mobilePhone", adminsController.putResetPassword);

adminsRouter.post("/ads/add-ads", adminsController.postAddAds);

adminsRouter.get("/ads/all-ads", adminsController.getAllAds);

adminsRouter.delete("/ads/delete-ads/:adsId", adminsController.deleteAds);

module.exports = adminsRouter;