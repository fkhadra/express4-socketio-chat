var express = require('express');
var router = express.Router();
var sanitize = require('validator');
var avatars = [];

/* GET home page. */
router.get('/', function(req, res, next) {

	for(i = 0; i < 8; i++){
		avatars.push("/images/avatars/"+i+".jpg");
	}
  res.render('index/index', { title: 'Slider Communicator', asChat: false, avatars : avatars});
}).post('/', function(req, res, next){
	var login = sanitize.escape(req.body.login);
	var id = req.body.avatar;

	if(login.length > 1 && login != ' ') {
		req.session.isLogged = false;
		req.session.avatar = avatars[id];
		req.session.login  = login;
		res.redirect('/users');
	} else {
		res.redirect('/');
	}

});

module.exports = router;
