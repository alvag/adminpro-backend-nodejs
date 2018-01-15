var bcrypt = require("bcryptjs");
var Usuario = require("../models/usuario");
var paginacion = require("../helpers/paginacion_helper");

function get(req, res) {
    var id = req.params.id;
    if (id) {
        Usuario.findById(id, "nombre email img role", (err, usuario) => {
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
        var cant = Number(req.query.cant) || 10;

        Usuario.find({}, "nombre email img role")
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

        /* Usuario.paginate({}, { page: 1, limit: 3 }).then(response => {
                                                                                                                                                                                                                                                                        console.log(response);
                                                                                                                                                                                                                                                                    }); */

        /* 
                                                                                                                                                                                                                                                            var pag = req.query.pag || 1;
                                                                                                                                                                                                                                                            var cant = req.query.cant || 10;

                                                                                                                                                                                                                                                            Usuario.find({}, "nombre email img role").paginate(
                                                                                                                                                                                                                                                                pag,
                                                                                                                                                                                                                                                                cant,
                                                                                                                                                                                                                                                                (err, usuarios, total) => {
                                                                                                                                                                                                                                                                    console.log(total);
                                                                                                                                                                                                                                                                    if (err) {
                                                                                                                                                                                                                                                                        return res.status(500).json({
                                                                                                                                                                                                                                                                            error: true,
                                                                                                                                                                                                                                                                            mensaje: "Error cargando usuarios",
                                                                                                                                                                                                                                                                            errors: err
                                                                                                                                                                                                                                                                        });
                                                                                                                                                                                                                                                                    }

                                                                                                                                                                                                                                                                    res.status(200).json({ error: false, usuarios, total });
                                                                                                                                                                                                                                                                }
                                                                                                                                                                                                                                                            );
                                                                                                                                                                                                                                                             */
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

        res.status(201).json({ error: false, usuario });
    });
}

function update(req, res) {
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

            res.status(200).json({ error: false, usuario: usuarioGuardado });
        });
    });
}

function del(req, res) {
    var id = req.params.id;

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

        res.status(200).json({ error: false, usuario });
    });
}

module.exports = {
    get,
    create,
    update,
    del
};