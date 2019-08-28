const list = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");

function main(len = 256, str){
  let s = "";
  str = str||list;
  while((len>0&&len--))
    s+=str[~~(Math.random()*str.length)];
  return s;
}

module.exports = main;
