var bcrypt = require("bcryptjs");
var Usuario = require("../models/usuario");
var jwt = require("../helpers/jwt_helper");
var config = require("../config");

// var GoogleAuth = require("google-auth-library");
//const { GoogleAuth } = require("google-auth-library");
//var auth = new GoogleAuth();

const GoogleAuth = require("google-auth-library");

function login(req, res) {
    var body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuario) => {
        if (err) {
            return res.status(500).json({
                error: true,
                mensaje: "Error el buscar usuario.",
                errors: err
            });
        }

        if (!usuario || !bcrypt.compareSync(body.password, usuario.password)) {
            return res.status(400).json({
                error: true,
                mensaje: "Credenciales incorrectas.",
                errors: { message: "Credenciales incorrectas." }
            });
        }

        usuario.password = undefined;

        var token = jwt.createToken(usuario);

        res
            .status(200)
            .json({ error: false, usuario, token, menu: obtenerMenu(usuario.role) });
    });
}

function google(req, res) {
    var token = req.body.token;

    var client = new GoogleAuth.OAuth2Client(
        config.GOOGLE_CLIENT_ID,
        config.GOOGLE_SECRET,
        ""
    );

    client.verifyIdToken({ idToken: token, audience: config.GOOGLE_CLIENT_ID },
        function(err, login) {
            if (err) {
                return res.status(400).json({
                    error: true,
                    mensaje: "Error al iniciar sesión.",
                    errors: err
                });
            }

            var payload = login.getPayload();
            var userid = payload.sub;

            Usuario.findOne({ email: payload.email }, (err, usuario) => {
                if (err) {
                    return res.status(500).json({
                        error: true,
                        mensaje: "Error al buscar usuario.",
                        errors: err
                    });
                }

                if (usuario) {
                    if (usuario.google === false) {
                        return res.status(400).json({
                            error: true,
                            mensaje: "Debe iniciar sesión con usuario y contraseña.",
                            errors: {
                                message: "Debe iniciar sesión con usuario y contraseña."
                            }
                        });
                    } else {
                        usuario.password = undefined;

                        var token = jwt.createToken(usuario);

                        res.status(200).json({
                            error: false,
                            usuario,
                            token,
                            menu: obtenerMenu(usuario.role)
                        });
                    }
                } else {
                    var newUser = new Usuario();
                    newUser.nombre = payload.name;
                    newUser.email = payload.email;
                    newUser.password = "null";
                    newUser.img = payload.picture;
                    newUser.google = true;

                    newUser.save((err, usuarioGuardado) => {
                        if (err) {
                            return res.status(500).json({
                                error: true,
                                mensaje: "Error al registrar usuario.",
                                errors: err
                            });
                        }

                        var token = jwt.createToken(newUser);

                        res.status(201).json({
                            error: false,
                            usuario: usuarioGuardado,
                            token,
                            menu: obtenerMenu(usuarioGuardado.role)
                        });
                    });
                }
            });
        }
    );
}

function obtenerMenu(role) {
    var menu = [{
            titulo: "Principal",
            icono: "mdi mdi-gauge",
            submenu: [
                { titulo: "Dashboard", url: "/dashboard" },
                { titulo: "Progressbar", url: "/progress" },
                { titulo: "Gráficas", url: "/graficas1" },
                { titulo: "Promesas", url: "/promesas" },
                { titulo: "RXJS", url: "/rxjs" }
            ]
        },
        {
            titulo: "Mantenimientos",
            icono: "md mdi-folder-lock-open",
            submenu: [
                { titulo: "Usuarios", url: "/usuarios" },
                { titulo: "Hospitales", url: "/hospitales" },
                { titulo: "Médicos", url: "/medicos" }
            ]
        }
    ];

    /* if (role === "ADMIN_ROLE") {
          menu[1].submenu.unshift({
              titulo: "Usuarios",
              url: "/usuarios"
          });
      } */

    return menu;
}

module.exports = {
    login,
    google
};