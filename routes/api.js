var express = require('express');
var router = express.Router();
var manage = new (require("../modules/schedule.manage"))(__dirname, "../public/document");
//const manage = new require("../modules/schedule.manage")(__dirname, "../public/document");

router.get('/', (req, res)=>{
  res.send("RESTful API");
})
router.get('/:db', (req, res)=>{ 
  console.log(manage.path);
  console.log(manage.get);
  res.send(req.params.db+".csv");
});

router.post('/:db', (req, res)=>{
  console.log('when add', req.params.db);
  console.log(manage.add);
  res.send("a");
})

router.put('/:db', (req, res)=>{
  console.log('when update', req.params.db);
  console.log(manage.update);
  res.send("b");
});

router.delete('/:db', (req, res)=>{
  console.log('when delete', req.params.db); 
  console.log(manage.delete);
  res.send("c");
});

module.exports = router;
