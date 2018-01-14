var express = require("express");
var mongoose = require("mongoose");

var app = express();

mongoose.connection.openUri(
    "mongodb://localhost:27017/hospitalDB",
    (err, res) => {
        if (err) throw err;

        console.log("Base de datos corriendo");
    }
);

app.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente!"
    });
});

app.listen(3000, () => {
    console.log("express server puerto 3000 online");
});