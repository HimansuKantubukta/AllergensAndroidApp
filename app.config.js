require('dotenv').config();

module.exports = () => {
    const env = (process.env.APP_ENV || 'dev').toLowerCase();
    if (env === "prd" || env === "prod" || env === "production") {
        return require("./app-prd.json");
    } else if (env === "uat" || env === "qa") {
        return require("./app-uat.json");
    } else if (env === "dev" || env === "development") {
        return require("./app-dev.json");
    } else {
        return require("./app-local.json");
    }
};
