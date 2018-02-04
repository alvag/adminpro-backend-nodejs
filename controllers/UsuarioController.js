var bcrypt = require("bcryptjs");
var Usuario = require("../models/usuario");
var paginacion = require("../helpers/paginacion_helper");

function get(req, res) {
    var id = req.params.id;
    if (id) {
        Usuario.findById(id, "nombre email img role google", (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    mensaje: "Error el buscar usuario.",
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    error: true,
                    mensaje: "El usuario no existe.",
                    errors: { message: "El usuario no existe." }
                });
            }

            res.status(201).json({ error: false, usuario });
        });
    } else {
        var pag = Number(req.query.pag) || 1;
        var cant = Number(req.query.cant) || 999;

        Usuario.find({}, "nombre email img role google")
            .skip((pag - 1) * cant)
            .limit(cant)
            .exec((err, usuarios) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error cargando usuarios",
                        errors: err
                    });
                }

                Usuario.count({}, (err, conteo) => {
                    res.status(200).json({
                        error: false,
                        usuarios,
                        paginacion: paginacion.paginar(req.route.path, conteo, pag, cant)
                    });
                });
            });
    }
}

function create(req, res) {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: "Error el crear usuario.",
                errors: err
            });
        }

        usuario.password = undefined;

        res.status(201).json({ error: false, usuario });
    });
}

function update(req, res) {
    if (req.body.email === "alva85@gmail.com") {
        return res.status(403).json({
            error: true,
            mensaje: "Esto es imposible!",
            errors: {
                message: "Nunca tendrás el poder suficiente para cambiar los datos de este usuario."
            }
        });
    } else {
        var id = req.params.id;

        Usuario.findById(id, (err, usuario) => {
            if (err) {
                return res.status(500).json({
                    error: true,
                    mensaje: "Error el buscar usuario.",
                    errors: err
                });
            }

            if (!usuario) {
                return res.status(400).json({
                    error: true,
                    mensaje: "El usuario no existe.",
                    errors: { message: "El usuario no existe." }
                });
            }

            var body = req.body;
            usuario.nombre = body.nombre;
            usuario.email = body.email;
            usuario.role = body.role;

            usuario.save((err, usuarioGuardado) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "Error actualizar usuario.",
                        errors: err
                    });
                }

                usuarioGuardado.password = undefined;

                res.status(200).json({ error: false, usuario: usuarioGuardado });
            });
        });
    }
}

function del(req, res) {
    var id = req.params.id;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error el buscar usuario.",
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                error: true,
                mensaje: "El usuario no existe.",
                errors: { message: "El usuario no existe." }
            });
        }

        if (usuario.email === "alva85@gmail.com") {
            return res.status(403).json({
                error: true,
                mensaje: "Esto es imposible!",
                errors: {
                    message: "Nunca tendrás el poder suficiente para eliminar este usuario."
                }
            });
        } else {
            Usuario.findByIdAndRemove(id, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error al eliminar el usuario.",
                        errors: err
                    });
                }

                if (!usuario) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "El usuario no existe.",
                        errors: { message: "El usuario no existe." }
                    });
                }

                usuario.password = undefined;

                res.status(200).json({ error: false, usuario });
            });
        }
    });
}

module.exports = {
    get,
    create,
    update,
    del
};