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

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (!file) {
            req.uploadError = "Sorry, No File Uploaded, Please Upload The File";
            return cb(null, false);
        }
        if (
            file.mimetype !== "image/jpeg" &&
            file.mimetype !== "image/png" &&
            file.mimetype !== "image/webp"
        ){
            req.uploadError = "Sorry, Invalid File Mimetype, Only JPEG, PNG And Webp files are allowed !!";
            return cb(null, false);
        }
        cb(null, true);
    }
});

module.exports = upload;