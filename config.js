module.exports = {
    SECRET_KEY: "miclavedetokens",
    db: process.env.MONGODB || "mongodb://localhost:27017/hospitalDB",
    port: process.env.PORT || 3000,
    url: "http://localhost:3000/api",
    GOOGLE_CLIENT_ID: "961872950765-f68d1nn2eleag3e61e9cb13hhol576h2.apps.googleusercontent.com",
    GOOGLE_SECRET: "Srip0fBxUiiUrm_FHOimgXqm"
};