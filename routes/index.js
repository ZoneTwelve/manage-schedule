var express = require('express');
var router = express.Router();

const hasher = require("../modules/hasher");

const fs = require("fs");
const config = JSON.parse(fs.readFileSync(`${__dirname}/../bin/config.db.json`));

router.get('/', function(req, res, next) {
  res.render('index', {title:config.name});
});

router.get('/manage', (req, res)=>{
  //default password: default
  if(req.session.info!=undefined){
    return res.render("manage", {title:config.name});
  }
  return res.render("login", {message:""});
});

router.post('/manage', (req, res)=>{
  if(typeof req.body.pwd=="string"&&hasher(hasher(req.body.pwd, "sha256"), "sha512")==config.password){
    req.session.info = {
      user:["admin"],
      access:["root", "read", "upload", "modify", "delete"],
      allow:[],
      deny:[]
    };
    return res.redirect('/manage');
  };
  return res.render("login", {message:"wrong password"});
});

router.post('/system', (req, res)=>{
  if(req.session.info&&req.session.info.user.indexOf("admin")>-1){
    if(typeof req.body.pwd=="string"&&typeof req.body.opwd==="string"){
      if(req.body.cpwd===req.body.pwd){
        if(hasher(hasher(req.body.opwd, "sha256"), "sha512")!=config.password)
          return res.status(400).send("舊密碼不相符");
        config.password = hasher(hasher(req.body.pwd, "sha256"), "sha512");
        fs.writeFileSync(`${__dirname}/../bin/config.db.json`, JSON.stringify(config));
        //req.session.info = undefined;
        return res.redirect("/manage");
        //return res.render('/login', {message:"密碼修改成功, 請重新登入"});
      }else{
        return res.status(400).send("確認密碼與新密碼不相符")
      }
    }else{
      return res.status(400).send("get out, fucking hacker");
    }
  }
  return res.redirect("/manage");
  //return res.status(403).send("please login again");
});

module.exports = router;
