var express = require("express");
var api = express.Router();

var auth = require("../middlewares/auth");

var usuarioController = require("../controllers/UsuarioController");
var hospitalController = require("../controllers/HospitalController");
var medicoController = require("../controllers/MedicoController");
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

/* Hospitales */
api.get("/hospital", [auth.isAuth], hospitalController.get);
api.get("/hospital/:id", [auth.isAuth], hospitalController.get);
api.post("/hospital", [auth.isAuth], hospitalController.create);
api.put("/hospital/:id", [auth.isAuth], hospitalController.update);
api.delete("/hospital/:id", [auth.isAuth], hospitalController.del);

/* Médicos */
api.get("/medico", [auth.isAuth], medicoController.get);
api.get("/medico/:id", [auth.isAuth], medicoController.get);
api.post("/medico", [auth.isAuth], medicoController.create);
api.put("/medico/:id", [auth.isAuth], medicoController.update);
api.delete("/medico/:id", [auth.isAuth], medicoController.del);

module.exports = api;