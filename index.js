var express = require("express");
var app = express();
var redis = require("redis");
var path = require("path");
var eventSource = require("server-event-fork")({
	express: app
});
var bodyParser = require("body-parser")();
var events = new(require("events").EventEmitter)();

// Remove cap on event listeners in EventEmitter
events.setMaxListeners(0);

var pub = redis.createClient();
var sub = redis.createClient();

var bower_libs = express.static(path.join(__dirname, "/bower_components"));

app.use(bodyParser);

app.get("/chat/room/:room", eventSource, function (req, res) {
	var room = req.param("room");
	console.log("User connecting to SSE for", room);
	listen("room:message:" + room, relay_data);
	req.socket.on("close", function () {
		unlisten(room, relay_data);
	});

	function relay_data(data) {
		res.sse(data);
	}
});

app.post("/chat/room/:room/message", function (req, res, next) {
	var room = req.param("room");
	var data = req.param("data");
	console.log("User messaging", room, "with", data);
	pub.publish("room:message:" + room, data);
	res.json(200, {
		message: "OK"
	});
});

function listen(name, fn) {
	if (events.listeners(name).length === 0) {
		sub.subscribe(name);
		console.log("Subscribing to", name);
	}
	events.on(name, fn);
}

function unlisten(name, fn) {
	events.removeListener(name, fn);
	if (events.listeners(name).length === 0) {
		console.log("Unsubscribing to", name);
		sub.unsubscribe(name);
	}
}

sub.on("message", function (name, data) {
	events.emit(name, data);
	console.log("Message to", name, ":\t", data);
});

// Serve bower_components as if they were in /lib
app.use("/lib", bower_libs);

// Serve regular static files from the root
app.use(express.static(path.join(__dirname, "/static")));

// Listen to the PORT environment var, or 80
app.listen(process.env.PORT || 80);
