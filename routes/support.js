/*jshint esversion: 6 */
const express = require("express");
const cookie = require('cookie');
const router = express.Router();
var io = null;
function websocketIO(serverio){
    io = serverio;

}

router.get('/',(req,res)=>{

  var rnd = Math.random()*10;
  io.emit("fun",rnd);
  res.redirect("http://gud.chs.chalmers.se/aspa.html");


});
router.get('/fun',(req,res)=>{
  res.render("fun.html");


});


module.exports ={"router":router, "sock":websocketIO};
