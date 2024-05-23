const mongoose = require("mongoose");

require("dotenv").config({
    path: "./.env",
});

// create Admin User Schema For Admin User Model

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userType: {
        type: String,
        default: "admin",
    },
});

// create Admin User Model In Database

const adminModel= mongoose.model("admin", adminSchema);

// require bcryptjs module for password encrypting

const { hash } = require("bcryptjs");

async function create_admin_user_account() {
    try {
        await mongoose.connect(process.env.DB_URL);
        const user = await adminModel.findOne({ email: process.env.MAIN_ADMIN_EMAIL });
        if (user) {
            await mongoose.disconnect();
            return "Sorry, Can't Insert Admin Data To Database Because it is Exist !!!";
        } else {
            const encrypted_password = await hash(process.env.MAIN_ADMIN_PASSWORD, 10);
            const new_admin_user = new adminModel({
                email: process.env.MAIN_ADMIN_EMAIL,
                password: encrypted_password,
            });
            await new_admin_user.save();
            await mongoose.disconnect();
            return "Ok !!, Create Admin Account Is Successfuly !!";
        }
    } catch(err) {
        await mongoose.disconnect();
        throw Error(err);
    }
}

create_admin_user_account().then((result) => console.log(result));