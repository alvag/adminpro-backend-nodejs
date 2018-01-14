var express = require("express");
var api = express.Router();

var Usuario = require("../models/usuario");
var usuarioController = require("../controllers/UsuarioController");

api.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente!"
    });
});

/* Usuarios */
api.get("/usuario", usuarioController.get);
api.get("/usuario/:id", usuarioController.get);
api.post("/usuario", usuarioController.create);
api.put("/usuario/:id", usuarioController.update);
api.delete("/usuario/:id", usuarioController.del);

module.exports = api;