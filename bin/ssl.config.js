const fs = require("fs");
module.exports = {
  key: fs.readFileSync(`${__dirname}/private.pem`),
  cert: fs.readFileSync(`${__dirname}/certificate.pem`)
};

