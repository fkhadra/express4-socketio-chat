var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
	if(req.session.login && req.session.login != null && req.session.avatar && req.session.isLogged !== true){
		 req.session.isLogged = true;
		res.render('users/index',{asChat: true});
	} else {
		res.redirect('/');
	}

});

module.exports = router;
