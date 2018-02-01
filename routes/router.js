var express = require("express");
var api = express.Router();

var auth = require("../middlewares/auth");

var usuarioController = require("../controllers/UsuarioController");
var hospitalController = require("../controllers/HospitalController");
var medicoController = require("../controllers/MedicoController");
var busquedaController = require("../controllers/BusquedaController");
var loginController = require("../controllers/LoginController");
var uploadController = require("../controllers/UploadController");
var imagenesController = require("../controllers/ImagenesController");

/* api.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente!"
    });
}); */

/* Login */
api.post("/login", loginController.login);
api.post("/login/google", loginController.google);

/* Usuarios */
api.get("/usuario", usuarioController.get);
api.get("/usuario/:id", usuarioController.get);
api.post("/usuario", usuarioController.create);
api.put(
    "/usuario/:id", [auth.isAuth, auth.isAdminOrSelf],
    usuarioController.update
);
api.delete("/usuario/:id", [auth.isAuth, auth.isAdmin], usuarioController.del);

/* Hospitales */
api.get("/hospital", hospitalController.get);
api.get("/hospital/:id", hospitalController.get);
api.post("/hospital", [auth.isAuth], hospitalController.create);
api.put("/hospital/:id", [auth.isAuth], hospitalController.update);
api.delete("/hospital/:id", [auth.isAuth], hospitalController.del);

/* Médicos */
api.get("/medico", medicoController.get);
api.get("/medico/:id", medicoController.get);
api.post("/medico", [auth.isAuth], medicoController.create);
api.put("/medico/:id", [auth.isAuth], medicoController.update);
api.delete("/medico/:id", [auth.isAuth], medicoController.del);

/* Búsqueda */
api.get("/busqueda/todo/:q", busquedaController.todo);
api.get("/busqueda/:coleccion/:q", busquedaController.coleccion);

/* Upload */
api.put("/upload/:tipo/:id", [auth.isAuth], uploadController.upload);

/* Obtener imagen */
api.get("/img/:tipo/:img", imagenesController.get);

module.exports = api;