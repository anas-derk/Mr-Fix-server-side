const adminRouter = require("express").Router();

const adminController = require("../controllers/admin.controller");

adminRouter.get("/login", adminController.getAdminLogin);

adminRouter.get("/admin-info/:adminId", adminController.getAdminInfo);

adminRouter.get("/requests/:requestId/users/:userId", adminController.getRequestSenderInfo);

adminRouter.put("/reset-password/:mobilePhone", adminController.putResetPassword);

adminRouter.post("/ads/add-ads", adminController.postAddAds);

adminRouter.get("/ads/all-ads", adminController.getAllAds);

module.exports = adminRouter;