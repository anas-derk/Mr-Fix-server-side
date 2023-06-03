const multer = require("multer");

// create and configuration storage object for manipulate with files before uploading

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./assets/images");
    },
    filename: (req, file, cb) => {
        cb(null, `${Math.random()}_${Date.now()}__${file.originalname}`);
    },
});

// create upload object for uploading the files after configure it

const upload = multer({ storage: storage });

module.exports = upload;