const express = require('express');
var app = express();
const http = require('http').createServer(app)
const path = require('path');
const index = require("./routes/index.js");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mustacheExpress = require('mustache-express');
var io = require('socket.io')(http);
io.on('connection', function(socket){
  console.log('a user connected');
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
	socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
//const app = express();
app.use(bodyparser.urlencoded({ extended: false }))
app.use("/", index);
app.set('views', [path.join(__dirname, '/VTT/views'),path.join(__dirname,'/views')]);
app.use(express.static(path.join(__dirname, '/views')));
app.use('/vtt/css',express.static(path.join(__dirname,'/VTT/views/css')));
app.engine('html', mustacheExpress());


app.use(cookieParser());
app.set('view engine', 'html');
process.env.TZ = 'Europe/Stockholm';


app.all("/*", function(req, res, next) {


	next();
});

// Catch 404 and forward to error handler
app.use(function(err, req, res, next) {
    err.status = 404;
    next(err);
});
 // Exception handling
if (app.get("env") === "development") {
    console.log("In development mode");
    app.use(function(err, req, res, next) {
        console.log("Error:" + err.stack);
        res.status(err.status || 500);
				res.send("error");
    });
} else {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.send("error");
    });
}
	console.log("before listening");
	http.listen(80, ()=>{
	console.log("Listening at port 8080");

});

module.exports = app;
