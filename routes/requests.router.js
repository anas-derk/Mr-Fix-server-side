const requestsRouter = require("express").Router();

const requestsController = require("../controllers/requests.controller");

const upload = require("../global/multer.config");

const { validateJWT } = require("../middlewares/global.middlewares");

requestsRouter.post("/create-new-request", upload.any(), requestsController.postServiceRequest);

requestsRouter.get("/all-requests", validateJWT, requestsController.getAllRequests);

module.exports = requestsRouter;