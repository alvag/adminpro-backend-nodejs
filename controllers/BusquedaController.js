var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");
var paginacion = require("../helpers/paginacion_helper");

function todo(req, res) {
    var q = req.params.q;
    var regEx = new RegExp(q, "i");

    Promise.all([
        buscarHospitales(regEx),
        buscarMedicos(regEx),
        buscarUsuarios(regEx)
    ]).then(respuestas => {
        res.status(200).json({
            error: false,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });
}

function coleccion(req, res) {
    var q = req.params.q;
    var coleccion = req.params.coleccion;
    var regEx = new RegExp(q, "i");

    var pag = Number(req.query.pag) || 1;
    var cant = Number(req.query.cant) || 10;

    var promesa;

    switch (coleccion) {
        case "usuarios":
            promesa = buscarUsuarios(regEx, pag, cant);
            break;
        case "medicos":
            promesa = buscarMedicos(regEx);
            break;
        case "hospitales":
            promesa = buscarHospitales(regEx, pag, cant);
            break;
        default:
            return res.status(400).json({
                error: true,
                mensaje: "La búsqueda no pudo ser procesada",
                errors: {
                    message: "La búsqueda no pudo ser procesada"
                }
            });
    }

    var path = "/busqueda/" + coleccion + "/" + q;

    promesa.then(data => {
        res.status(200).json({
            error: false,
            [coleccion]: data.data,
            paginacion: paginacion.paginar(path, data.conteo, pag, cant)
        });
    });
}

function buscarHospitales(regEx, pag, cant) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regEx })
            .skip((pag - 1) * cant)
            .limit(cant)
            .exec((err, hospitales) => {
                if (err) {
                    reject();
                } else {
                    Hospital.count({ nombre: regEx }).exec((err, conteo) => {
                        if (err) {
                            reject();
                        } else {
                            var data = { data: hospitales, conteo };
                            resolve(data);
                        }
                    });
                }
            });
    });
}

function buscarMedicos(regEx, pag, cant) {
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regEx }, (err, medicos) => {
            if (err) {
                reject();
            } else {
                resolve(medicos);
            }
        });
    });
}

function buscarUsuarios(regEx, pag, cant) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "nombre img email role google")
            .or([{ nombre: regEx }, { email: regEx }])
            .skip((pag - 1) * cant)
            .limit(cant)
            .exec((err, usuarios) => {
                if (err) {
                    reject();
                } else {
                    Usuario.count({})
                        .or([{ nombre: regEx }, { email: regEx }])
                        .exec((err, conteo) => {
                            if (err) {
                                reject();
                            } else {
                                var data = {
                                    data: usuarios,
                                    conteo
                                };
                                resolve(data);
                            }
                        });
                }
            });
    });
}

module.exports = {
    todo,
    coleccion
};