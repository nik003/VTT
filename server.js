const express = require('express');
var app = express();
const http = require('http').createServer(app)
const path = require('path');
const index = require("./routes/index.js");
const vtt = require("./routes/vtt.js");
const cookieParser = require("cookie-parser");
const bodyparser = require("body-parser");
const mustacheExpress = require('mustache-express');


app.use(bodyparser.urlencoded({
  extended: false
}))
app.use("/vtt", vtt);
app.use("/", index);
app.set('views', [path.join(__dirname, '/views'), path.join(__dirname, '/views')]);
app.use(express.static(path.join(__dirname, '/views')));
app.use('/css', express.static(path.join(__dirname, '/views/css')));
app.engine('html', mustacheExpress());


app.use(cookieParser());
app.set('view engine', 'html');
process.env.TZ = 'Europe/Stockholm';
process.on('uncaughtException', (err) => {


});


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

http.listen(8080, () => {
  console.log("Listening at port 8080");

});

module.exports = app;
