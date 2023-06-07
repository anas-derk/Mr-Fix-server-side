const requestsRouter = require("express").Router();

const requestsController = require("../controllers/requests.controller");

const upload = require("../global/multer.config");

requestsRouter.post("/create-new-request", upload.any(), requestsController.postServiceRequest);

requestsRouter.get("/all-requests", requestsController.getAllRequests);

module.exports = requestsRouter;