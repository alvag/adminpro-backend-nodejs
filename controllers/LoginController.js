var bcrypt = require("bcryptjs");
var Usuario = require("../models/usuario");
var jwt = require("../helpers/jwt_helper");

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

        res.status(200).json({ error: false, usuario, token });
    });
}

module.exports = {
    login
};