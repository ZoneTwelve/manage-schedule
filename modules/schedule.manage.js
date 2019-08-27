var fs = require("fs");
var path = require("path");

function main( {root, db, tmp} ){
//const main = ({root, path}) => {
  this.path = path.join(root, db);
  this.temp = path.join(root, tmp);
  if(!fs.existsSync(this.path)||!fs.existsSync(this.temp))
    throw `${this.path} or ${this.temp} is not exist`;
  this.cache = [];
}

// GET API
main.prototype.get = function( name ){
  //datatype:
  //  name: string
  let filepath = this.check(name);
  //path.join(this.path, name)//this.check(name);
  if(filepath==null||!fs.existsSync(filepath))
    return {error:"file is not exist or not allow"};
  let tmp = this.cache.find(obj=>obj.name==name);
  if(tmp!=undefined)
    return tmp;
  let result = {
    name:name,
    data:this.read(filepath),
    time:Number(new Date())
  };
  this.cache.push(result);
  return result;
}

main.prototype.read = function( filepath ){
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
  return data;
}

// POST API
main.prototype.add = function({ name, data }){
  //datatype:
  //  name: string
  //  data: buffer
  let filepath = this.check(name);
  if(filepath==null||fs.existsSync(filepath))
    return {error:"name is not allow or already exist", name:name};
  fs.writeFileSync(filepath, data);
  return {message:"upload success, now you can query /schedule/"+name};
}

// PUT API
main.prototype.update = function({ name, data }){
  //datetype:
  //  name: string
  //  data: buffer
  let filepath = this.check(name);
  if(filepath==null||!fs.existsSync(filepath))
    return {error:"name is not allow or not exist", name:name};
  fs.writeFileSync(filepath, data);
  return {message:"the file been update, now you can query /schedule/"+name};
}

// DELETE API
main.prototype.remove = function( name ){
  //datetype:
  //  name: string
  console.log(this.path, name);
  let filepath = this.check(name);
  console.log("file", filepath, name);
  // ^[A-Za-z\-0-9]+$/ match up or lowercase alphebet、"-" and number 0-9
  // ^[\u4e00-\u9fa5_a-zA-Z0-9]+$ chinese、"_"、alphebet and number
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(name)||name.length==0)
    return {error:"access denied"};
  if(filepath!=null){
    fs.unlinkSync(filepath)
    let index = this.cache.indexOf(this.cache.find(v=>v.name==name));
    if(index>-1)
      this.cache.splice(index, 1);
    return {message:`success, ${name} been delete`};
  }
  return {error:"delete fail, file is not exist"};
}


main.prototype.check = function(filename, root){
  root = root||this.path;
  let filepath = path.join(this.path, filename);
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(filename))
    return null;
  return filepath;
  //return fs.existsSync(filepath)?filepath:null;
}

module.exports = main;
