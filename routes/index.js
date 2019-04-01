const express = require("express");
const cookie = require('cookie');
const stopData = require('../requests/stopData.js');
const router = express.Router();
const auth = require('../auth/oauth2conn.js');
const fs = require('fs');




let devCounter=1;
let ip_list = {};
router.get('/',(req,res)=>{


  res.render("index.html");


});
router.post('/',(req,res)=>{
	res.render("index.html");

});
router.get('/1',(req,res)=>{
  let ip_addr;
  if(req.headers['x-forwarded-for']==undefined){
    ip_addr = req.connection.remoteAddress;
  }else{
    ip_addr=req.headers['x-forwarded-for'];
  }


  let d = new Date();
  let curTime = getTime();

  cookieHandling(req,res,(accessToken)=>{
    stopData.getStops(accessToken,0,(data)=>{
//      console.log(data.stop);
      objData=divideData(req,data);
      res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:data.stop,board:objData.list});
//      console.log(objData.list);
    });


  });


});
router.get('/2',(req,res)=>{

  let size = req.query.size;
  let curTime = getTime();
  cookieHandling(req,res,(accessToken)=>{
    stopData.getStops(accessToken,1,(data)=>{
      objData=divideData(req,data);
      res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:data.stop,board:objData.list});


    });


  });


});
router.get('/3',(req,res)=>{
  let size = req.query.size;
  let curTime = getTime();
  cookieHandling(req,res,(accessToken)=>{
      stopData.getStops(accessToken,2,(data)=>{
        objData=divideData(req,data);
        res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:data.stop,board:objData.list});


    });


  });


});

router.get('/4',(req,res)=>{
  let size = req.query.size;
  let curTime = getTime();
  let counter = 0;
  let objData = [];
  cookieHandling(req,res,(accessToken)=>{
    stopData.getStops(accessToken,0,(chalmersData)=>{
      if(counter == 1){
          console.log(objData);
          if(objData.stopData[0].destination == 'No available transportation'){
            objData.stopData = chalmersData.stopData;
          }else{
            objData.stopData  = objData.stopData.concat(chalmersData.stopData);
          }


          objData = divideData(req,objData);
          res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:"Chalmers",board:objData.list});
      }else{
        objData = chalmersData;
        counter++;
     }

    });
      stopData.getStops(accessToken,2,(chalmersplatsenData)=>{
        if(counter == 1){
            if(objData.stopData[0].destination == 'No available transportation'){
              objData.stopData = chalmersplatsenData.stopData;
            }else{
              objData.stopData  = objData.stopData.concat(chalmersplatsenData.stopData);
            }
            objData = divideData(req,objData);
            res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:"Chalmers",board:objData.list});
        }else{
          objData = chalmersplatsenData;
          //console.log(chalmersplatsenData);
          counter++;
        }


    });


  });


});
router.get('/5',(req,res)=>{
  let size = req.query.size;
  let curTime = getTime();
  cookieHandling(req,res,(accessToken)=>{
      stopData.getStops(accessToken,3,(data)=>{
        objData=divideData(req,data);
        res.render('index.html',{curtime:curTime,txtSize: objData.textSize,stop:data.stop,board:objData.list});


    });


  });


});
function cookieHandling(req,res,callback){
	let ip_addr;
	if(req.headers['x-forwarded-for']==undefined){
		ip_addr = req.connection.remoteAddress;
	}else{
		ip_addr=req.headers['x-forwarded-for'];
	}
	console.log( new Date() + ip_addr);
	console.log("Requested" + req.url);
	fs.appendFile('consoleLogs.log', new Date() + ip_addr + "\n "+ "Requested" + req.url +"\n" , (err)=> {
		if (err) throw err;
	});
  if(req.headers.cookie ==undefined){
	if(ip_list[ip_addr] ==undefined){

		devCounter++;
		ip_list[ip_addr] = devCounter;
		devName = "device_"+devCounter;
	}else{

		devName = "device_"+ip_list[ip_addr];
	}


    devName = "device_"+devCounter;
    res.setHeader('Set-Cookie', cookie.serialize('devName', devName, {
      httpOnly: true,
     maxAge: 60 * 60 * 24 * 7 // 1 week
    }));

  }else{
    let cookies = cookie.parse(req.headers.cookie || '');
    devName = cookies.devName;

  }
  auth.connectAuth(devName,(accessToken)=>{
      callback(accessToken);

  });
}
function divideData(req,data){
  let size = req.query.size;
  let rows = req.query.rows;
  let pageNum = req.query.pageNum

  size = (size==undefined) ? 50:size;
  rows = (rows==undefined) ? 0:rows;
  pageNum = (pageNum==undefined) ? 1:pageNum;
  if(((pageNum-1)*rows)+1 > data.stopData.length){
    pageNum =1;
  }
  if(rows !=0){
      data.stopData = data.stopData.slice((pageNum-1)*rows,pageNum*rows);

  }
  return {list:data.stopData,textSize:size};



}
function getTime(){
  let d = new Date();
  let h = d.getHours();
  let m = d.getMinutes();
  if(h<10){
    h = '0'+h;
  }
  if(m<10){
    m = '0'+m;
  }
  return (h+':'+m);

}
module.exports = router;
