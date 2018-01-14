const mongoose = require("mongoose");
const config = require("./config");
const app = require("./app");

mongoose.Promise = global.Promise;
mongoose
    .connect(config.db, { useMongoClient: true })
    .then(() => {
        console.log("Conexión establecida con la base datos.");

        app.listen(config.port, () => {
            console.log(`API REST corriendo en http://localhost:${config.port}`);
        });
    })
    .catch(err => console.log(err));