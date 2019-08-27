var express = require('express');
var router = express.Router();
var manage = new (require("../modules/schedule.manage"))({
  root:__dirname, 
  db:"../public/document", 
  tmp:"../public/document/temp" 
});
//const manage = new require("../modules/schedule.manage")(__dirname, "../public/document");

var multer  = require('multer');
var upload = multer({ dest:manage.temp });

const fs = require("fs");

router.get('/', (req, res)=>{
  res.send("RESTful API");
})
router.get('/:db', (req, res)=>{ 
  if(req.query.review==="1")
    return res.json()
  return res.json(manage.get(req.params.db));
  //console.log(manage.path);
  //console.log(manage.get);
  //res.send(req.params.db+".csv");
});

router.post('/:db', upload.single("table"), (req, res)=>{
  console.log(req.file);
  let target = req.file.path;
  let result = manage.add({
    name:req.params.db,
    data:fs.readFileSync(target)
  });
  return res.status(result.error?400:200).send(result);
})

router.put('/:db', (req, res)=>{
  console.log('when update', req.params.db);
  console.log(manage.update);
  res.send("b");
});

router.delete('/:db', (req, res)=>{
  //console.log('when delete', req.params.db); 
  //console.log(manage.delete);
  console.log("delete", req.params.db);
  let result = (manage.remove(req.params.db));
  res.status(result.error?403:200).send(result);
});

// feature: restrict access
// use access token to get passport
router.get("/access/:token", (req, res)=>{
  
});

// add new access token
router.post("/access/:token", (req, res)=>{
  
});

// delete access token
router.delete("/access/:token", (req, res)=>{

});

module.exports = router;
