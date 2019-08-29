var fs = require("fs");
var path = require("path");

const random = require("./random");

var filetype = ".csv";


function main( {root, db, tmp} ){
//const main = ({root, path}) => {
  this.path = path.join(root, db);
  this.temp = path.join(root, tmp);
  this.users = [
    {name:"admin",note:"administrator",allow:[],deny:[]},
    {name:"test-"+random(12),note:"tester",allow:["example"],deny:[]}
  ];
  console.log(this.users[1]);
  if(!fs.existsSync(this.path)||!fs.existsSync(this.temp))
    throw `${this.path} or ${this.temp} is not exist`;
  this.refresh();
}

// GET API
main.prototype.get = function( name ){
  //datatype:
  //  name: string
  let filepath = this.check(name);
  //path.join(this.path, name)//this.check(name);
  if(filepath==null||!fs.existsSync(filepath+filetype))
    return {error:"file is not exist or not allow"};
  let tmp = this.cache.find(obj=>obj.name==name);
  if(tmp!=undefined){
    tmp.time = Number(new Date());
    return tmp;
  }
  let table = this.read(filepath);
  let result = {
    name:name,
    subject:table.subject,
    data:table.data,
    cache:Number(new Date())
  };
  this.cache.push(result);
  result.time = Number(new Date());
  return result;
}

main.prototype.read = function( filepath ){
  let file = fs.readFileSync(filepath+filetype, "utf8").split("\n");
  let subject = file.shift().split(",");
  let data = file.map(v=>{
    let object = new Object();
    let content = v.split(",");
    subject.forEach((t, i)=>{
      object[t] = content[i];
    });
    return object;
  })
  return {subject:subject, data:data};
}

// POST API
main.prototype.add = function({ name, data }){
  //datatype:
  //  name: string
  //  data: buffer
  let filepath = this.check(name);
  if(filepath==null||fs.existsSync(filepath+filetype))
    return {error:"name is not allow or already exist", name:name};
  this.list.push(name);
  fs.writeFileSync(filepath+filetype, data);
  this.refresh();
  return {message:"upload success, now you can query /schedule/"+name};
}

// PUT API
main.prototype.update = function({ name, data }){
  //datetype:
  //  name: string
  //  data: buffer
  let filepath = this.check(name);
  if(filepath==null||!fs.existsSync(filepath+filetype))
    return {error:"name is not allow or not exist", name:name};
  fs.writeFileSync(filepath+filetype, data);
  this.refresh();
  return {message:"the file been update, now you can query /schedule/"+name};
}

// DELETE API
main.prototype.remove = function( name ){
  //datetype:
  //  name: string
  let filepath = this.check(name);
  // ^[A-Za-z\-0-9]+$/ match up or lowercase alphebet、"-" and number 0-9
  // ^[\u4e00-\u9fa5_a-zA-Z0-9]+$ chinese、"_"、alphebet and number
  if(!/^[\u4e00-\u9fa5_a-zA-Z0-9]+$/.test(name)||name.length==0)
    return {error:"access denied"};
  if(filepath!=null&&this.list.indexOf(name)>-1){
    fs.unlinkSync(filepath+filetype)
    let index = this.cache.indexOf(this.cache.find(v=>v.name==name));
    if(index>-1)
      this.cache.splice(index, 1);
    this.refresh();
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

main.prototype.refresh = function(){
  this.cache = [];
  this.list = fs.readdirSync(this.path).filter(v=>/\.csv$/.test(v)).map(v=>v.replace(/\.csv$/, ""));
}

// this function will check the token for access the schedule system
main.prototype.find = function(user){
  if(typeof user=="string"){
    for(let usr of this.users){
      console.log(usr.name, user);
      if(usr.name==user)
        return usr;
    }
    return {error:"user is not defined"};
  }else if(typeof usr==="object"){
    for(let usr of this.users){
      let token = user.find(u=>usr.user==user.name);
      if(token!=undefined) 
        return token;
    }
  }

  return {error:"can not find the user from user list"};
}

main.prototype.generate = function( {uid, note, allow, deny} ){
  if(!/^[a-zA-Z_]+$/.test(mark))
    return {error:"the mark can not be set spical character, only allow a-z A-Z、number and \"_\""};
  let token = {
    name:`${random(128)}${user==undefined?"":("-"+uid)}`,
    note:note,
    allow:allow,
    deny:deny
  };
  this.users.push(token);
  return token;
}

module.exports = main;
