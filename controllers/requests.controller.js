function postServiceRequest(req, res) {
    let requestImages = [];
    for(let file of req.files) {
        requestImages.push(file.path);
    }
    let requestInfo = {
        ...Object.assign({}, req.body),
        files: requestImages,
    };
    const { createNewRequest } = require("../models/requests.model");
    createNewRequest(requestInfo).then((result) => {
        res.json(result);
    })
    .catch((err) => {
        const { unlinkSync } = require("fs");
        for (let file of requestImages.files) {
            unlinkSync(file.path);
        }
    });
}

module.exports = {
    postServiceRequest,
}