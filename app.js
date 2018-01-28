var express = require("express");
var app = express();
var path = require("path");
var bodyParser = require("body-parser");
var appRoutes = require("./routes/router");
var fileUpload = require("express-fileupload");

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use(fileUpload());

app.use("/api", appRoutes);

app.use("/", express.static("dist", { redirect: false }));
app.get("*", function(req, res, next) {
    res.sendFile(path.resolve("dist/index.html"));
});

module.exports = app;