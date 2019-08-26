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
main.prototype.get = function( name ){
  //datatype:
  //  name: string
  let filepath = path.join(this.path, name)//this.check(name);

  if(filepath!=null){
    let file = fs.readFileSync(filepath, "utf8").split("\n");
    let subject = file.shift().split(",");
    let data = file.map(v=>{
      let object = new Object();
      let content = v.split(",");
      subject.forEach((t, i)=>{
        object[t] = content[i];
      });
      return object;
    })
    return { name:name, data:data };
  }
  return {error:"file is not exist"};
}

// POST API
main.prototype.add = function({ name, data }){
  //datatype:
  //  name: string
  //  data: buffer
  
}

// PUT API
main.prototype.update = function({ name, data }){
  //datetype:
  //  name: string
  //  data: buffer
}

// DELETE API
main.prototype.remove = function( name ){
  //datetype:
  //  name: string
  console.log(this.path, name);
  let filepath = this.check(name);
  console.log("file", filepath, name);
  if(!/^.[A-Za-z]+$/.test(name)||name.length==0)
    return {error:"access denied"};
  if(filepath!=null){
    fs.unlinkSync(filepath)
    return {message:`success, ${name} been delete`};
  }
  return {error:"delete fail, file is not exist"};
}



main.prototype.check = function(filename){
  let filepath = path.join(this.path, filename);
  return fs.existsSync(filepath)?filepath:null;
}

module.exports = main;
