var config = require("../config");

function paginar(path, conteo, pag, cant) {
    var paginas = Math.ceil(conteo / cant);
    var _pag = pag + 1;
    var nextPage = null;
    if (pag < paginas) {
        nextPage = config.url + path + "?pag=" + _pag + "&cant=" + cant;
    }

    var previousPage = null;
    _pag = pag - 1;
    if (_pag > 0) {
        previousPage = config.url + path + "?pag=" + _pag + "&cant=" + cant;
    }

    return { total: conteo, paginas, nextPage, previousPage };
}

module.exports = {
    paginar
};