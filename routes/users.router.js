const usersRouter = require("express").Router();

const usersController = require("../controllers/users.controller");

usersRouter.post("/create-new-user", usersController.createNewUser);

usersRouter.get("/login", usersController.login);

usersRouter.get("/user-info/:userId", usersController.getUserInfo);

module.exports = usersRouter;