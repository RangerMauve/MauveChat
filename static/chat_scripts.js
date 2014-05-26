var model = {};

var chat = {
	name: "",
	rooms: [],
	messages: [],
	current_room: "lobby",
	current_text: "",
	post_to_current: function () {
		console.log("Posting", chat.current_text, "to", chat.current_room, "as", chat.name);
		reqwest({
			url: "/chat/room/" + chat.current_room + "/message",
			method: "post",
			data: {
				data: chat.current_text
			},
			error: console.error.bind(console)
		});
	},
	join_new: function () {
		console.log("Joining new room", prompt("Enter room name"));
	},
	listen_to: function (room) {
		if (!room) return;
		console.log("Listening to SSE for", room);
		var es = new ServerSentEvent("/chat/room/" + room);
		es.on("message", function (data) {
			chat.messages.push({
				room: room,
				text: data
			});
		});
		es.on("error", console.error.bind(console));
	}
};

(function () {
	var name = localStorage.getItem("username");
	while (!name)
		name = prompt("Enter your username");
	localStorage.setItem("username", name);
	chat.name = name;
	var room = "";
	initRoomData();

	function initRoomData() {
		// TODO: Actually load room data
		chat.rooms.push({
			name: "lobby",
			users: [chat.name]
		});
		chat.rooms.forEach(function (room) {
			chat.listen_to(room.name);
		});
	}
	model.chat = chat;
})();

rivets.bind(document.body, model);
