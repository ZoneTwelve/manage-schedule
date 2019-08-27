window.onload = function(){
  load("example");
}

function load(name){
  request(name, (db)=>{
    setup(db);
  })
}

function setup(db){
  document.querySelector("#title").innerText = db.name;
  document.querySelector("#schedule>table>thead").innerHTML="";
  document.querySelector("#schedule>table>tbody").innerHTML="";
  let thead = createElement("tr");
  for(let c of db.subject){
    thead.appendChild(createElement("td", c, {
      "background":"black",
      "color":"white"
    }));
  }
  for(let content of db.data){
    let tbody = createElement("tr");
    for(let el of Object.keys(content))
      tbody.appendChild(createElement("td", content[el], {
        "color":"black"
      }));
    document.querySelector("#schedule>table>tbody").appendChild(tbody);
  }

  document.querySelector("#schedule>table>thead").appendChild(thead);
}
function createElement(tag, content = "", setting = {}){
  let el = document.createElement(tag);
  el.innerText = content;
  for(let set of Object.keys(setting)){
    el['style'][set] = setting[set];
  };
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
