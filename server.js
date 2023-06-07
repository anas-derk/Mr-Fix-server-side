/* Start Import And Create Express App */

const express = require("express");

const app = express();

/* End Import And Create Express App */

/* Start Config The Server */

const cors = require("cors"),
    bodyParser = require("body-parser");

app.use(cors());

app.use(bodyParser.json());

/* Start direct the browser to statics files path */

const path = require("path");

app.use("/assets", express.static(path.join(__dirname, "assets")));

/* End direct the browser to statics files path */

/* End Config The Server */

/* Start Running The Server */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`The Server Is Running On: http://localhost:${PORT}`));

/* End Running The Server */

/* Start Handle The Routes */

const   usersRouter = require("./routes/users.router"),
        requestsRouter = require("./routes/requests.router"),
        adminRouter = require("./routes/admin.router");

app.use("/users", usersRouter);

app.use("/requests", requestsRouter);

app.use("/admin", adminRouter);

/* End Handle The Routes */