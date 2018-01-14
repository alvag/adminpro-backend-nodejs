var express = require("express");
var api = express.Router();

var auth = require("../middlewares/auth");

var usuarioController = require("../controllers/UsuarioController");
var loginController = require("../controllers/LoginController");

/* api.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente!"
    });
}); */

/* Login */
api.post("/login", loginController.login);

/* Usuarios */
api.get("/usuario", [auth.isAuth], usuarioController.get);
api.get("/usuario/:id", [auth.isAuth], usuarioController.get);
api.post("/usuario", [auth.isAuth], usuarioController.create);
api.put("/usuario/:id", [auth.isAuth], usuarioController.update);
api.delete("/usuario/:id", [auth.isAuth], usuarioController.del);

module.exports = api;