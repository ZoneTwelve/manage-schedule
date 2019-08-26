var fs = require("fs");
var path = require("path");

function main(root, target){
//const main = ({root, path}) => {
  this.path = path.join(root, target);
  if(!fs.existsSync(this.path))
    throw `${this.path} is not exist`;
  this.cache = [];
}

// GET API
main.prototype.get = ({ name }) => {
  //datatype:
  //  name: string
}

// POST API
main.prototype.add = ({ name, data }) => {
  //datatype:
  //  name: string
  //  data: buffer
}

// PUT API
main.prototype.update = ({ name, data}) => {
  //datetype:
  //  name: string
  //  data: buffer
}

// DELETE API
main.prototype.delete = ({ name }) => {
  //datetype:
  //  name: string
}

module.exports = main;
