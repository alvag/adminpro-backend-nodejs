module.exports = {
    SECRET_KEY: "miclavedetokens",
    db: process.env.MONGODB || "mongodb://localhost:27017/hospitalDB",
    port: process.env.PORT || 3000,
    url: "http://localhost:3000/api"
};