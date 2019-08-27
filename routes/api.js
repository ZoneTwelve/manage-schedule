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

// 取得資料
router.get('/list', (req, res)=>{
  console.log(manage);
  res.json(manage.list);
})
router.get('/:db', (req, res)=>{ 
  return res.json(manage.get(req.params.db));
});

router.post('/:db', upload.single("table"), (req, res)=>{
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
  let result = (manage.remove(req.params.db));
  res.status(result.error?403:200).send(result);
});

// feature: restrict access
// use access token to get passport
router.get("/access/:token", (req, res)=>{
  //取得存取權限 session
});

// add new access token
router.post("/access/:token", (req, res)=>{
  //新增存取權杖
});

// delete access token
router.delete("/access/:token", (req, res)=>{
  //刪除存取權杖
});

module.exports = router;
