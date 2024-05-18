/* Start Import And Create Express App */

const express = require("express");

const app = express();

const path = require("path");

const cors = require("cors");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

require("dotenv").config();

/* End Import And Create Express App */

/* Start Running The Server */

const PORT = process.env.PORT || 4000;

app.listen(PORT, async () => {

    console.log(`The Server Is Running On: http://localhost:${PORT}`);

    try {

        await mongoose.connect(process.env.DB_URL);

        /* Start Config The Server */

        app.use(cors({
            origin: "*"
        }));

        app.use(bodyParser.json());

        /* End Config The Server */

        /* Start direct the browser to statics files path */

        app.use("/assets", express.static(path.join(__dirname, "assets")));

        /* End direct the browser to statics files path */

        /* Start Handle The Routes */

        app.use("/users", require("./routes/users.router"));

        app.use("/requests", require("./routes/requests.router"));

        app.use("/admin", require("./routes/admins.router"));
        
        /* End Handle The Routes */
    }
    catch (err) {
        console.log(err);
    }

});

/* End Running The Server */

/* Start Handling Events */

mongoose.connection.on("connected", () => console.log("connected"));
mongoose.connection.on("disconnected", () => console.log("disconnected"));
mongoose.connection.on("reconnected", () => console.log("reconnected"));
mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
mongoose.connection.on("close", () => console.log("close"));

process.on("SIGINT", async () => {
    await mongoose.connection.close();
});

/* End Handling Events */

module.exports = {
    mongoose,
}