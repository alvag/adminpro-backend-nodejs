var jwt = require("jsonwebtoken");
var moment = require("moment");
var config = require("../config");

function createToken(user) {
    return jwt.sign({
            _id: user._id,
            nombre: user.nombre,
            email: user.email,
            role: user.role
        },
        config.SECRET_KEY, { expiresIn: 14440 }
    );
}

function decodeToken(token) {
    return new Promise((resolve, reject) => {
        try {
            var payload = jwt.verify(token, config.SECRET_KEY);
            resolve(payload);
        } catch (err) {
            reject({ message: "Token incorrecto", status: 401 });
        }
    });
}

module.exports = {
    createToken,
    decodeToken
};