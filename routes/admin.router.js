const adminRouter = require("express").Router();

const adminController = require("../controllers/admin.controller");

adminRouter.get("/login", adminController.getAdminLogin);

adminRouter.get("/admin-info/:adminId", adminController.getAdminInfo);

module.exports = adminRouter;