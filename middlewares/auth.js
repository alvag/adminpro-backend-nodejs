var jwt = require("../helpers/jwt_helper");

function isAuth(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({
            error: true,
            mensaje: "No tienes autorización."
        });
    }

    const token = req.headers.authorization.split(" ")[1];

    jwt
        .decodeToken(token)
        .then(response => {
            req.user = response;
            next();
        })
        .catch(response => {
            return res.status(response.status).json({
                error: true,
                mensaje: response.message
            });
        });
}

function isAdmin(req, res, next) {
    var usuario = req.user;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(403).json({
            error: true,
            mensaje: "No tienes autorización.",
            errors: { message: "No tienes autorización." }
        });
    }
}

function isAdminOrSelf(req, res, next) {
    var usuario = req.user;
    var id = req.params.id;

    if (usuario.role === "ADMIN_ROLE" || usuario.sub === id) {
        next();
    } else {
        return res.status(403).json({
            error: true,
            mensaje: "No tienes autorización.",
            errors: { message: "No tienes autorización." }
        });
    }
}

module.exports = { isAuth, isAdmin, isAdminOrSelf };