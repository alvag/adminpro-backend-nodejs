var Hospital = require("../models/hospital");
var paginacion = require("../helpers/paginacion_helper");

function get(req, res) {
    var id = req.params.id;
    if (id) {
        Hospital.findById(id)
            .populate("usuario", "nombre email img role")
            .exec((err, hospital) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error el buscar hospital.",
                        errors: err
                    });
                }

                if (!hospital) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "El hospital no existe.",
                        errors: { message: "El hospital no existe." }
                    });
                }

                res.status(201).json({ error: false, hospital });
            });
    } else {
        var pag = Number(req.query.pag) || 1;
        var cant = Number(req.query.cant) || 999;

        Hospital.find({})
            .populate("usuario", "nombre email img role")
            .skip((pag - 1) * cant)
            .limit(cant)
            .exec((err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error cargando hospitales",
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        error: false,
                        hospitales,
                        paginacion: paginacion.paginar(req.route.path, conteo, pag, cant)
                    });
                });
            });
    }
}

function create(req, res) {
    var body = req.body;
    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.user.sub
    });

    hospital.save((err, hospital) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: "Error el crear hospital.",
                errors: err
            });
        }

        res.status(201).json({ error: false, hospital });
    });
}

function update(req, res) {
    var id = req.params.id;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error el buscar hospital.",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                error: true,
                mensaje: "El hospital no existe.",
                errors: { message: "El hospital no existe." }
            });
        }

        var body = req.body;
        hospital.nombre = body.nombre;
        hospital.usuario = req.user.sub;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: "Error actualizar hospital.",
                    errors: err
                });
            }

            res.status(200).json({ error: false, hospital: hospitalGuardado });
        });
    });
}

function del(req, res) {
    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospital) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error al eliminar el hospital.",
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                error: true,
                mensaje: "El hospital no existe.",
                errors: { message: "El hospital no existe." }
            });
        }

        res.status(200).json({ error: false, hospital });
    });
}

module.exports = {
    get,
    create,
    update,
    del
};