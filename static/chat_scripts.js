var model = {};

var chat = {
	name: "",
	rooms: [],
	messages: [],
	current_room: "lobby",
	current_text: "",
	post_to_current: function () {
		console.log("Posting", chat.current_text, "to", chat.current_room, "as", chat.name);
	},
	join_new: function () {
		console.log("Joining new room", prompt("Enter room name"));
	}
};

(function () {
	var name = localStorage.getItem("username");
	while (!name)
		name = prompt("Enter your username");
	chat.name = name;
	var room = "";
	initRoomData();

	function initRoomData() {
		// TODO: Actually load room data
		chat.rooms.push({
			name: "lobby",
			users: [chat.name]
		});
	}
	model.chat = chat;
})();

rivets.bind(document.body, model);
