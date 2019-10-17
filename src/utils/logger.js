const moment = require("moment");

const log = msg => {
    console.log(`[${moment()}]: ${msg}`);
};

export const logObj = (msg, obj) => {
    console.log(`[${moment()}]: ${msg}\n`, obj);
};

export default log;
