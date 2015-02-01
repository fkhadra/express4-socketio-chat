
$(document).ready(function () {


		var socket = io();
		var contact;

	var contactList = function(data, user) {
		var tmp= "";
		$.each(data, function(i, v){
			tmp += '<li id="'+ v.id+'"><img src="'+ v.avatar+'" /><span>'+ v.name +'</span></li>';
		});
		this.list=tmp;
		this.user = user;
	}

	contactList.prototype.getCurrentUser = function() {
		return this.user;
	}


	socket.on('connectedUser', function(data, user){

		contact = new contactList(data, user);
		$('#contact-list').html(contact.list);

	});



	socket.on('newUser', function(user){
		var newUser = '<li id="'+ user.id+'"><img src="'+ user.avatar+'" /><span>'+ user.name +'</span></li>';

		$('#contact-list').append(newUser)
		growl(false, user.name);

	});
		$('#msg').on('keypress', function(e){
			if(e.which === 13) {
				$('#msg-btn').trigger('click');
			}
		})
		$('#msg-btn').on('click', function(){
			var msg = $('#msg').val();

			if(msg.length > 1) {
				$('#msg').val('');
				var currentUser = contact.getCurrentUser();
				socket.emit('chat', msg);
				msg = validator.escape(msg);
				var dt = new Date();
				var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

				$('#chatbox').append('<li class="left clearfix"><span class="chat-img pull-left">' +
					'<img src="'+currentUser.avatar+'">' +
					'</span>' +
					'<div class="chat-body clearfix">' +
					'<div class="header"><strong class="primary-font">'+currentUser.name+' [<span class="glyphicon glyphicon-time"></span>'+time+'</small> ] : </strong>' +

					'</div>' +
					'<p>' + msg +'</p>' +
					'</div></li>');
				$(".chatbox").animate({ scrollTop: $(document).height() }, "slow");
			}
		});

		socket.on('chat', function(user){
			var dt = new Date();
			var time = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();

			$('#chatbox').append('<li class="right clearfix"><span class="chat-img pull-right">' +
				'<img src="'+user.avatar+'">' +
				'</span>' +
				'<div class="chat-body clearfix">' +
				'<div class="header"><strong class="primary-font">'+user.name+
				'[<span class="glyphicon glyphicon-time"></span>'+time+'</small>] : </strong>' +
				'</div>' +
				'<br /><p>' + user.msg +'</p>' +
				'</div></li>');
		});


		socket.on('removeUser', function(user){
			$('#'+user.id).remove();
			growl(true, user.name);
		});
});

function growl(removeUser, user){

	var type = "success";
	var msg  = user+' as join the channel';

	if(removeUser) {
		var type = "warning";
		var msg  = user+' as left the channel';
	}

	$.growl({
		message: msg
	},{
		element: 'body',
		type: type,
		allow_dismiss: true,
		placement: {
			from: "top",
			align: "right"
		},
		offset: 20,
		spacing: 10,
		z_index: 1031,
		delay: 5000,
		timer: 1000,
		mouse_over: false,
		animate: {
			enter: 'animated fadeInDown',
			exit: 'animated fadeOutUp'
		},
		icon_type: 'class'
	});
}


