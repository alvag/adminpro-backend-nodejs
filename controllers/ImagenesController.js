var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

var fs = require("fs");

function get(req, res) {
    var tipo = req.params.tipo;
    var img = req.params.img;

    var path = "./uploads/" + tipo + "/" + img;

    fs.exists(path, existe => {
        if (!existe) {
            path = "./assets/no-img.jpg";
        }

        res.sendFile(path, { root: "." });
    });
}

module.exports = {
    get
};