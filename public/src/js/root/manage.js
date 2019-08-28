const system = new System();
window.onload = function(){
  system.setup();
  for(var i=0,list=document.querySelectorAll("form[name]");i<list.length;i++){
    console.log(i, list[i]['name']);
    system.element[list[i]['name']] = list[i];
    list[i].onsubmit = system[list[i]["name"]];
  }
}

function System(){
  this.list = [];
  this.element = new Object();
}

System.prototype.setup = function(){
  request("list", (result)=>{
    if(result.error)
      return document.querySelector("h1").innerText = "系統發生錯誤";
    system.list = result;
    system.apply();
  });
}

System.prototype.apply = function(){
  this.element.del.table.innerHTML="";
  for(let val of this.list)
    this.element.del.table.appendChild(createElement("option", {value:val, innerText:val}));
  
  this.element.modify.table.innerHTML="";
  for(let val of this.list)
    this.element.modify.filename.appendChild(createElement("option", {value:val, innerText:val}));

}


System.prototype.upload = function(){
  console.log(this.table.files[0])
  //uploadFiles('/server', this.files);
  if(this.filename.value!=""&&this.table.files[0]!=undefined&&this.table.files[0].size<1024*10){
    uploadFiles("POST", this.filename.value, this.table.files[0],(result)=>{
      system.setup();
      alert(result.error||result.message);
    });
  }
  return false;
}

System.prototype.modify = function(){
  if(this.filename.value!=""&&this.table.files[0]!=undefined&&this.table.files[0].size<1024*10){
    uploadFiles("PUT", this.filename.value, this.table.files[0],(result)=>{
      system.setup();
      alert(result.error||result.message);                                                              
    });
  }
  return false;
}

System.prototype.del = function(){
  if(system.list.indexOf(this.table.value)==-1){
    alert(`找不到 ${this.table.value}`);
    return false;
  }
  if(!confirm(`確定要 ${this.table.value} 刪除嗎?`))
    return false;
  console.log("send");
  send(this.table.value, "DELETE", (result)=>{
    system.setup();
    alert(result.error||result.message);
  });
  return false;
}

function createElement(tag, content = {}, setting = {}){
  let el = document.createElement(tag);
  for(let set of Object.keys(setting)){
    el['style'][set] = setting[set];
  }
  for(let set of Object.keys(content)){
    el[set] = content[set];
  }
  return el;
}

function request(target, callback){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState==4){
      let json = JSON.parse(xhttp.responseText);
      callback(json);
    }
  };
  xhttp.open("GET", `/schedule/${target}`, true);
  xhttp.send();
}

function send(target, method, callback){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState==4){
      let json = JSON.parse(xhttp.responseText);
      callback(json);
    }
  };
  xhttp.open(method, `/schedule/${target}`, true);
  xhttp.send();
}

function uploadFiles(method, url, file, callback) {
  var formData = new FormData();
  //for (var i = 0, file; file = files[i]; ++i) {
  formData.append("table", file);
  //}

  var xhr = new XMLHttpRequest();
  xhr.open(method, `/schedule/${url}`, true);
  xhr.onreadystatechange = function() {
    if (this.readyState==4){
      let json = JSON.parse(xhr.responseText);
      callback(json);
    }
  };

  //xhr.onload = function(e) { ... };

  xhr.send(formData);  // multipart/form-data
}

//document.querySelector('input[type="file"]').addEventListener('change', function(e) {
//  uploadFiles('/server', this.files);
//}, false);