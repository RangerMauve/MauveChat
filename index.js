var express = require("express");
var redis = require("redis");
var path = require("path")

var app = express();

var bower_libs = express.static(path.join(__dirname, "/bower_components"));

// Serve bower_components as if they were in /lib
app.use("/lib", bower_libs);

// Serve regular static files from the root
app.use(path.join(__dirname,"/static"));

// Listen to the PORT environment var, or 80
app.listen(process.ENV.PORT || 80);
