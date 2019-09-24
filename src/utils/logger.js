const moment = require("moment");

const log = msg => {
  console.log(`[${moment()}]: ${msg}`);
};

export default log;
