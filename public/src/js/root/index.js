var list;
window.onload = function(){
  request("list", (db)=>{
    if(db.error)
      return document.querySelector("tbody").innerText = db.error;
    list = db;
    //let get = GET();
    let table = GET()["table"];//location.hash.substr(1, location.hash.length);
    let index = list.indexOf(table);
    /*
    let index = list.indexOf(get["table"]);
    load(db[index||0]);
    if(index==-1)
      alert("找不到"+get["table"]);
    if(get["hidden"]!==undefined)
      document.querySelector("h2").innerHTML="";
    */
    document.querySelector("#selector").onchange = function(){
      load(this.value);
    }
    for(let option of db)
      document.querySelector("#selector").appendChild(
        createElement("option", {value:option, innerText:option})
      );
    load(index==-1?0:index)
  })
}

function GET(){
  let obj = location.search.substr(1, location.search.length).split("&").map(g=>g.split("="));
  let result = new Object();
  obj.forEach(v=>{
    result[v[0]] = v[1];
  });
  return result;
}

function load(name){
  if(typeof name=="number"){
    document.querySelectorAll("option")[name+1].selected = true;
    name = list[name];
  }
  if(typeof name!="string"){
    name = this.value;
  }
  //別罵我拜託, 我只是沒想過會寫這個功能
  request(name, (db)=>{
    setup(db);
  })
}

function setup(db){
  //document.querySelector("#title").innerText = db.name;
  document.querySelector("#schedule>table>thead").innerHTML="";
  document.querySelector("#schedule>table>tbody").innerHTML="";
  let thead = createElement("tr");
  for(let c of db.subject){
    thead.appendChild(createElement("td", {innerText:c}));
  }
  for(let content of db.data){
    let tbody = createElement("tr");
    for(let el of Object.keys(content))
      tbody.appendChild(createElement("td", {innerText:content[el]}));
    document.querySelector("#schedule>table>tbody").appendChild(tbody);
  }

  document.querySelector("#schedule>table>thead").appendChild(thead);
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
      //if(this.status == 200);
    }
  };
  xhttp.open("GET", `/schedule/${target}`, true);
  xhttp.send();
}
