
var io = require('socket.io')();
var sanitize = require('validator');
var connectedUsers  = [];
var connectedSocket = [];

io.on('connection', function(socket) {
	var user      = {};
	var sessionId = socket.request.sessionID;
	var index;

	user.id     = sessionId;
	user.name   = socket.request.session.login;
	user.avatar = socket.request.session.avatar;

	if(typeof user.name != 'undefined'){

		connectedUsers.push({'id': user.id, 'avatar': user.avatar, 'name' : user.name});
		index = connectedUsers.length -1;
		connectedSocket[sessionId] = {'index': index, 'id': user.id, 'name': user.name}


		socket.emit('connectedUser', connectedUsers, user);

		socket.broadcast.emit('newUser', user);
	}

	socket.on('chat', function(msg) {
		var user = {};
		user.msg  = sanitize.escape(msg);
		user.name = socket.request.session.login;
		user.avatar = socket.request.session.avatar;

		socket.broadcast.emit('chat', user);
	});


	socket.on('disconnect', function(){
		var sessionId =  socket.request.sessionID;
		var disconnectedUser = connectedSocket[sessionId];

			connectedUsers.splice(disconnectedUser.index, 1);
			delete connectedSocket[sessionId];
			socket.broadcast.emit('removeUser', disconnectedUser);
	});
});



module.exports = io;