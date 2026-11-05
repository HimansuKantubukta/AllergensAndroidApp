require('dotenv').config();

module.exports = () => {
    if (process.env.APP_ENV === "prd") {
        return require("./app-prd.json");
    } else if (process.env.APP_ENV === "uat") {
        return require("./app-uat.json");
    } else if (process.env.APP_ENV === "dev") {
        return require("./app-dev.json");
    } else {
        return require("./app-local.json");
    }
};
