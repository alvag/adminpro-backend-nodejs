const express = require("express");
const api = express.Router();

var Usuario = require("../models/usuario");

api.get("/", (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: "Petición realizada correctamente!"
    });
});

/* Usuarios */
api.get("/usuario", (req, res, next) => {
    Usuario.find({}, "nombre email img role", (err, usuarios) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error cargando usuarios",
                errors: err
            });
        }

        res.status(200).json({
            error: false,
            usuarios
        });
    });
});

api.post("/usuario", (req, res) => {
    var body = req.body;
    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: body.password,
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error el crear usuario",
                errors: err
            });
        }

        res.status(201).json({ error: false, usuario });
    });
});

module.exports = api;