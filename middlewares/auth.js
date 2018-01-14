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

module.exports = { isAuth };