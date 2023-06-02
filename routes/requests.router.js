const requestsRouter = require("express").Router();

const requestsController = require("../controllers/requests.controller");

requestsRouter.post("/create-new-request", requestsController.postServiceRequest);

// requestsRouter.get("/login", usersController.login);

module.exports = requestsRouter;