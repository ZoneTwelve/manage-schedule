const system = new System();

window.onload = function(){
  system.setup();
  for(var i=0,list=document.querySelectorAll("form[name]");i<list.length;i++){
    console.log(i, list[i]['name']);
    system.element[list[i]['name']] = list[i];
    list[i].onsubmit = system[list[i]["name"]];
  }

  setup_qrcode();
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
  var defaultOption = "<option value='資料表, 請選擇資料'>請選擇資料表</option>";
  
  //setup delete's selector options
  this.element.del.table.innerHTML=defaultOption;
  
  //setup modify's selector options
  this.element.modify.filename.innerHTML=defaultOption;
  
  //setup key-gen's selector
  let ausel = this.element.addkey.querySelector('[name="ausel"]');
  let absel = this.element.addkey.querySelector('[name="absel"]');
  let dusel = this.element.addkey.querySelector('[name="dusel"]');
  let dbsel = this.element.addkey.querySelector('[name="dbsel"]');
  ausel.innerHTML = "";
  absel.innerHTML = "";
  dusel.innerHTML = "";
  dbsel.innerHTML = "";
  for(let val of this.list){
    this.element.del.table.appendChild(createElement("option", {value:val, innerText:val}));
  
    this.element.modify.filename.appendChild(createElement("option", {value:val, innerText:val}));

    
    ausel.appendChild(createElement("li", {onclick:this.putkey, innerText:val, db:absel}));
    dusel.appendChild(createElement("li", {onclick:this.putkey, innerText:val, db:dbsel}));
  }
  setup_qrcode();
}


System.prototype.upload = function(){
  console.log(this.table.files[0])
  //uploadFiles('/server', this.files);
  //this.reset();
  if(this.filename.value!=""&&this.table.files[0]!=undefined&&this.table.files[0].size<1024*10){
    uploadFiles("POST", this.filename.value, this.table.files[0],(result)=>{
      system.setup();
      alert(result.error||result.message);
      this.reset();
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

System.prototype.addkey = function(){
  if(!confirm("確定要生成金鑰嗎? 如果隨意生成金鑰可能造成資安問題喔"))
    return false;
  var formData = new FormData();
  let allow = system.element.addkey.querySelector('[name="absel"]').innerText.replace(/\n/g, ",");
  let deny = system.element.addkey.querySelector('[name="dbsel"]').innerText.replace(/\n/g, ",");
  let option = {
    uid:this.uid.value,
    note:this.note.value,
    limit:this.limit.value,
    allow:allow,
    deny:deny
  };
  let params = [];
  for(let obj in (option))
    params.push(`${encodeURIComponent(obj)}=${encodeURIComponent(option[obj])}`);
  console.log(params);
  


    var http = new XMLHttpRequest();
    http.open('POST', "/schedule/access", true);

    //Send the proper header information along with the request
    http.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

    http.onreadystatechange = function() {//Call a function when the state changes.
        if(http.readyState==4) {
            let json = JSON.parse(http.responseText);
            system.apply();
            alert(json.error||(`${location.origin}/login/${json.name}`));
            //alert(http.responseText);
        }
    }
    http.send(params.join("&"));



  
  //send("access", "POST", (result)=>{
  //  console.log(result);
  //}, "?"+params.join("&"));
  //console.log(absel.innerText.split("\n").join(","));
  return false;
}
System.prototype.putkey = function(){
  //console.log(this.parentElement);
  let target = this.db;
  if(this.parentElement.selected==this.innerText){
    this.className = "";
    this.db = this.parentElement;
    target.appendChild(this);
  }else{
    if(this.parentElement.object!=undefined)
      this.parentElement.object.className = "";
    this.parentElement.selected = this.innerText;
    this.parentElement.object = this;
    this.className = "selected";
  }
  return false;
}

System.prototype.delkey = function(){
  console.log(this);
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

function send(target, method, callback, params){
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState==4){
      let json = JSON.parse(xhttp.responseText);
      callback(json);
    }
  };
  xhttp.open(method, `/schedule/${target}`, true);
  xhttp.send(params);
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

  xhr.send(formData);  // multipart/form-data
}

function setup_qrcode(){
  var qrcon = document.querySelector("#qrcode-container");
  request("/access", (result)=>{
    console.log(result);
    qrcon.innerHTML="";
    for(let obj of result){
      let url = `${location.origin}/login/${obj.name}`;
      let con = createElement("div", {onclick:copyThisToken});
      
      con.qrcode = new QRCode(con, {height:150, width:150});
      con.qrcode.makeCode(url);
      con.url = url;
      let input = (createElement("input", {url:url, value:url}));
      let note = (createElement("p", { innerText:"備註: "+(obj.note==""?"沒有備註":obj.note)}));
      con.target = input;
      con.appendChild(note);
      con.appendChild(input);

      con.appendChild(createElement("p"));

      qrcon.appendChild(con);
    }
  });
}

function copyThisToken(){
  //this.disabled = false;
  this.target.value = this.url;
  console.log(this.target);
  this.target.select();
  this.target.setSelectionRange(0, 99999); /*For mobile devices*/
  //this.disabled = true;
  //this.parentElement.foucs();
  document.execCommand("copy");
  alert("網址複製成功");
}