var Medico = require("../models/medico");
var paginacion = require("../helpers/paginacion_helper");

function get(req, res) {
    var id = req.params.id;
    if (id) {
        Medico.findById(id)
            .populate("usuario", "nombre email img role")
            .populate("hospital")
            .exec((err, medico) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error el buscar médico.",
                        errors: err
                    });
                }

                if (!medico) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "El medico no existe.",
                        errors: { message: "El medico no existe." }
                    });
                }

                res.status(200).json({ error: false, medico });
            });
    } else {
        var pag = Number(req.query.pag) || 1;
        var cant = Number(req.query.cant) || 999;

        Medico.find({})
            .skip((pag - 1) * cant)
            .limit(cant)
            .populate("usuario", "nombre email img role")
            .populate("hospital")
            .exec((err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error cargando médicos",
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo) => {
                    res.status(200).json({
                        error: false,
                        medicos,
                        paginacion: paginacion.paginar(req.route.path, conteo, pag, cant)
                    });
                });
            });
    }
}

function create(req, res) {
    var body = req.body;
    var medico = new Medico({
        nombre: body.nombre,
        hospital: body.hospital,
        usuario: req.user._id
    });

    medico.save((err, medico) => {
        if (err) {
            return res.status(400).json({
                error: true,
                mensaje: "Error el crear médico.",
                errors: err
            });
        }

        res.status(201).json({ error: false, medico });
    });
}

function update(req, res) {
    var id = req.params.id;

    Medico.findById(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error el buscar médico.",
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                error: true,
                mensaje: "El médico no existe.",
                errors: { message: "El médico no existe." }
            });
        }

        var body = req.body;
        medico.nombre = body.nombre;
        medico.hospital = body.hospital;
        medico.usuario = req.user._id;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: "Error actualizar médico.",
                    errors: err
                });
            }

            res.status(200).json({ error: false, medico: medicoGuardado });
        });
    });
}

function del(req, res) {
    var id = req.params.id;

    Medico.findByIdAndRemove(id, (err, medico) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error al eliminar el médico.",
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                error: true,
                mensaje: "El médico no existe.",
                errors: { message: "El médico no existe." }
            });
        }

        res.status(200).json({ error: false, medico });
    });
}

module.exports = {
    get,
    create,
    update,
    del
};