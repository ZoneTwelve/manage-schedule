var manage = require("./schedule.manage");

let system = (new manage({
  root:__dirname, 
  db:"../public/document"
  temp:"../public/temp"    
}));

system.check("update");
