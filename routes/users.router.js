const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

usersRouter.post("/create-new-user", usersController.createNewUser);

usersRouter.get("/login", usersController.login);

usersRouter.get("/user-info/:userId", usersController.getUserInfo);

usersRouter.get("/forget-password", usersController.getForgetPassword);

usersRouter.put("/reset-password/:userId", usersController.putResetPassword);

usersRouter.put("/update-user-info/:userId", usersController.putProfile);

module.exports = usersRouter;