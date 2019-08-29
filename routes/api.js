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
  let list = manage.list;
  if(req.session.info.allow.length>0)
    list = list.filter(v=>req.session.info.allow.indexOf(v)>-1);
  if(req.session.info.deny.length>0)
    list = list.filter(v=>req.session.info.deny.indexOf(v)==-1);
  return res.json(list);
});

// feature: restrict access


router.get("/login", (req, res)=>{
  res.render("login", {message:""});
});

router.get("/login/:token", (req, res)=>{
  //取得存取權限 session
  if(typeof req.params.token==="string"){
    let user = manage.find(req.params.token);
    if(!user.error&&user.note!=="administrator"){
      req.session.info = {
        user:user.name,
        access:[],
        allow:user.allow,
        deny:user.deny
      };
      return res.redirect(302, "/");
    }
  }
  return res.render("login", {message:"這個連結已經失效, 請詢問負責的單位"});
  //res.status(401).send({error:"login fail"});
});


router.post("/login", (req ,res)=>{
  if(typeof req.body.pwd==="string"){
    let user = manage.find(req.body.pwd);
    if(!user.error&&user.note!=="administrator"){
      req.session.info = {
        user:user.name,
        access:[],
        allow:user.allow,
        deny:user.deny
      };
      /*
      req.session.info = req.session.info||new Object();
      req.session.info.user = req.session.info.user||[];
      req.session.info.user = req.session.info.user||[];
      req.session.info.allow = req.session.info.allow||[];
      req.session.info.deny = req.session.info.deny||[];
      */
      return res.redirect("/");
      //return res.send({message:"success"});
    }
  }

  return res.status(401).send({error:"login fail"});
});

// use access token to get passport
router.get("/access", checkaccess, (req, res)=>{
  //取得存取權限 session
  let usr = isuser(req.session);
  if(usr.error)
    return res.status(403).send(usr);
});

// add new access token
router.post("/access", checkaccess, (req, res)=>{
  //新增存取權杖
  console.log(req.body);
  req.body.limit = parseInt(req.body.limit);
  let usr = isuser(req.session);
  if(usr.error)
    return res.status(403).send(usr);
  
  if(typeof req.body.uid=="string"&&
     typeof req.body.note=="string"&&
     typeof req.body.allow=="string"&&
     typeof req.body.deny=="string"&&
     !isNaN(req.body.limit)){
    
    let user = manage.generate({
      uid:req.body.uid,
      note:req.body.note,
      allow:req.body.allow.split(",").filter(v=>v.length>0),
      deny:req.body.deny.split(",").filter(v=>v.length>0)
    });
    return res.send(user);
  }
  return res.send({error:"missing some variable"});
});

// delete access token
router.delete("/access/:token", (req, res)=>{
  //刪除存取權杖
});


//database api

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
