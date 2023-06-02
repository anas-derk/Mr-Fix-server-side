function postServiceRequest(req, res) {
    let requestInfo = req.body;
    const { createNewRequest } = require("../models/requests.model");
    createNewRequest(requestInfo).then((result) => {
        res.json(result);
    })
        .catch((err) => res.json(err));
}

module.exports = {
    postServiceRequest,
}