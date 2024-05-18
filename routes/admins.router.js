const adminsRouter = require("express").Router();

const adminsController = require("../controllers/admins.controller");

adminsRouter.get("/login", adminsController.getAdminLogin);

adminsRouter.get("/admin-info/:adminId", adminsController.getAdminInfo);

adminsRouter.get("/requests/:requestId/users/:userId", adminsController.getRequestSenderInfo);

adminsRouter.put("/reset-password/:mobilePhone", adminsController.putResetPassword);

module.exports = adminsRouter;