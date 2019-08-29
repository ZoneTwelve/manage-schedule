var express = require('express');
var router = express.Router();
const fs = require("fs");

var manage = new (require("../modules/schedule.manage"))({
  root:__dirname, 
  db:"../document", 
  tmp:"../document/temp" 
});
var multer  = require('multer');
var upload = multer({ dest:manage.temp });


router.get('/', (req, res)=>{
  res.send("RESTful API");
})

// 取得資料
router.get('/list', checkaccess, (req, res)=>{
  res.json(manage.list);
})
router.get('/:db', (req, res)=>{ 
  return res.json(manage.get(req.params.db));
});

router.post('/:db', checkaccess, upload.single("table"), (req, res)=>{
  let usr = isuser(req.session);
  if(usr.error)
    return res.status(403).send(usr);
  let target = req.file.path;
  let result = manage.add({
    name:req.params.db,
    data:fs.readFileSync(target)
  });
  fs.unlinkSync(target);
  return res.status(result.error?400:200).send(result);
})

router.put('/:db', checkaccess, upload.single("table"), (req, res)=>{
  let usr = isuser(req.session);
  if(usr.error)
    return res.redirect("/manage");
  var target = req.file.path;
  let result = manage.update({
    name:req.params.db,
    data:fs.readFileSync(target)
  });
  fs.unlinkSync(target);
  return res.status(result.error?400:200).send(result);
});

router.delete('/:db', checkaccess, (req, res)=>{
  let usr = isuser(req.session);
  if(usr.error)
    return res.redirect("/manage");
  let result = (manage.remove(req.params.db));
  res.status(result.error?403:200).send(result);
});

// feature: restrict access
// use access token to get passport
router.get("/access/:token", (req, res)=>{
  //取得存取權限 session
});

// add new access token
router.post("/access/:token", checkaccess, (req, res)=>{
  //新增存取權杖
  let usr = isuser(req.session);
  if(usr.error)
    return res.status(403).send(usr);
});

// delete access token
router.delete("/access/:token", (req, res)=>{
  //刪除存取權杖
});

function isuser(sess, user = "admin"){
  if(sess==undefined)
    return {error:"we got the system error, please report to the management department"};
  if(sess.info&&sess.info.user){
    let index = sess.info.user.indexOf(user)
    if(index>-1)
      return {message:"user find!", id:index};
    else
      return {error:"user not found"};
  }
  return {error:"your not the admin!!!!", id:index};
}

function checkaccess(req, res, next){
  let sess = req.session;
  if(sess.info&&sess.info.user&&manage.find(sess.user)!=undefined)
    return next();
  return res.status(403).send({error:"you don't have the access for management, please login again", link:"/login"});
}

module.exports = router;
