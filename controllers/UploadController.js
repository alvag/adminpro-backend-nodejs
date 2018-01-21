var Hospital = require("../models/hospital");
var Medico = require("../models/medico");
var Usuario = require("../models/usuario");

var fileUpload = require("express-fileupload");
var fs = require("fs");

function upload(req, res) {
    var tipo = req.params.tipo;
    var id = req.params.id;

    /* Tipos de  */
    var tiposValidos = ["hospitales", "medicos", "usuarios"];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            error: true,
            mensaje: "El tipo de colección no es válida",
            errors: {
                message: "El tipo de colección no es válida"
            }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            error: true,
            mensaje: "No seleccionó ningúna imagen",
            errors: { message: "No seleccionó ningúna imagen" }
        });
    }

    /* Obtener el nombre del archivo */
    var archivo = req.files.imagen;
    var fileName = archivo.name.split(".");
    var extFile = fileName[fileName.length - 1];

    /* Validar extension de archivo */
    var extValidas = ["png", "jpg", "gif", "jpeg"];

    if (extValidas.indexOf(extFile) < 0) {
        return res.status(400).json({
            error: true,
            mensaje: "Exensión no válida",
            errors: {
                message: "Las extensiones válidas son " + extValidas.join(", ")
            }
        });
    }

    /* Nombre de archivo personalizado */
    fileName = id + "-" + new Date().getMilliseconds() + "." + extFile;

    /* Mover el archivo */
    var path = "./uploads/" + tipo + "/" + fileName;
    archivo.mv(path, err => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error al mover el archivo",
                errors: {
                    message: err
                }
            });
        }

        subirPorTipo(tipo, id, fileName, res);

        /* res.status(200).json({
                                        error: false,
                                        mensaje: "Archivo subido"
                                    }); */
    });
}

function subirPorTipo(tipo, id, fileName, res) {
    if (tipo === "usuarios") {
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

            var currentPath = "./uploads/usuarios/" + usuario.img;
            /* Si existe una imagen anterior la borramos */
            if (fs.existsSync(currentPath)) {
                fs.unlink(currentPath);
            }

            usuario.img = fileName;
            usuario.save((err, usuarioActualizado) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "Error actualizar usuario.",
                        errors: err
                    });
                }

                usuarioActualizado.password = undefined;

                return res.status(200).json({
                    error: false,
                    mensaje: "Imagen de usuaio actualizada",
                    usuario: usuarioActualizado
                });
            });
        });
    }

    if (tipo === "hospitales") {
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

            var currentPath = "./uploads/hospitales/" + hospital.img;
            /* Si existe una imagen anterior la borramos */
            if (fs.existsSync(currentPath)) {
                fs.unlink(currentPath);
            }

            hospital.img = fileName;
            hospital.save((err, hospitalActualizado) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "Error actualizar hospital.",
                        errors: err
                    });
                }

                return res.status(200).json({
                    error: false,
                    mensaje: "Imagen del hospital actualizada",
                    hospital: hospitalActualizado
                });
            });
        });
    }

    if (tipo === "medicos") {
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

            var currentPath = "./uploads/medicos/" + medico.img;
            /* Si existe una imagen anterior la borramos */
            if (fs.existsSync(currentPath)) {
                fs.unlink(currentPath);
            }

            medico.img = fileName;
            medico.save((err, medicoActualizado) => {
                if (err) {
                    return res.status(400).json({
                        error: true,
                        mensaje: "Error actualizar médico.",
                        errors: err
                    });
                }

                return res.status(200).json({
                    error: false,
                    mensaje: "Imagen del médico actualizada",
                    medico: medicoActualizado
                });
            });
        });
    }
}

module.exports = {
    upload
};