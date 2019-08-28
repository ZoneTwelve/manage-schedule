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
    console.log(1);
    return res.render("manage", {title:config.name});
  }
  return res.render("login", {message:""});
});

router.post('/manage', (req, res)=>{
  if(hasher(hasher(req.body.pwd, "sha256"), "sha512")==config.password){
    req.session.info = {
      user:["admin"],
      access:["root", "read", "upload", "modify", "delete"],
      allow:[],
      deny:[]
    };
    return res.redirect('/manage');
  };
  return res.render("login", {message:"wrong password"});
})

module.exports = router;
