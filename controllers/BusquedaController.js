var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

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

    var promesa;

    switch (coleccion) {
        case "usuarios":
            promesa = buscarUsuarios(regEx);
            break;
        case "medicos":
            promesa = buscarMedicos(regEx);
            break;
        case "hospitales":
            promesa = buscarHospitales(regEx);
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

    promesa.then(data => {
        res.status(200).json({ error: false, [coleccion]: data });
    });
}

function buscarHospitales(regEx) {
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regEx }, (err, hospitales) => {
            if (err) {
                reject();
            } else {
                resolve(hospitales);
            }
        });
    });
}

function buscarMedicos(regEx) {
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

function buscarUsuarios(regEx) {
    return new Promise((resolve, reject) => {
        Usuario.find({}, "nombre img email role google")
            .or([{ nombre: regEx }, { email: regEx }])
            .exec((err, usuarios) => {
                if (err) {
                    reject();
                } else {
                    resolve(usuarios);
                }
            });
    });
}

module.exports = {
    todo,
    coleccion
};