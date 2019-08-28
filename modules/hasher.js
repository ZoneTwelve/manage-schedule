const crypto = require('crypto');
function generateHash(str, alg){
  if(str==undefined||typeof str!=="string")
    return undefined;
  let hash = crypto.createHash(alg);
  hash.update(str);
  return hash.digest('hex'); 
}
module.exports = generateHash;