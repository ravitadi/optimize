'use strict';

var express = require('express'),
		http = require('http'),
		app = express(),
		ipaddress = process.env.OPENSHIFT_NODEJS_IP,
	 	port = process.env.OPENSHIFT_NODEJS_PORT || 8000;

 if (typeof ipaddress === "undefined") {
 					console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1:8000');
             ipaddress = "127.0.0.1";
 }
//console.log(__dirname);
app.set('views', 'app/jade/jadepages');
app.set('view engine', 'jade');
app.set('port', port);
app.use('/', express.static('app/'));
app.use(express.json());
app.use(express.bodyParser());

//cache set
app.use(express.static(__dirname + '/imgs', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/css', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/js', { maxAge: 86400000 }));

//show home page here
renderCorrectPage('/','home');


function renderCorrectPage(path, page){
	app.get(path, function(req, resp){
		resp.render(page, {css_file: page});
	});
}

function signUp(name, email, desc, callback){
	var MailChimpAPI = require('mailchimp').MailChimpAPI,
	    API_KEY = 'feff5c1e72c5294f3a3564f2c5c42386-us6',
		LIST_ID = '7a6ce43042';
    var api = new MailChimpAPI(API_KEY , { version : '1.3', secure : false }),
	    names = name.split(' '),
			data = {
				apikey: API_KEY,
				id: LIST_ID,
				email_address : email,
				merge_vars: {'FNAME': names[0], 'LNAME': names[1], 'MMERGE3' : desc},
				double_optin: false,
				send_welcome: true
			};

	 api.listSubscribe(data, function(error, result) {
			if(error){
				console.log(error);
				callback(error);
			}else {
				callback(null, result);
			}
		});
}

app.post('/subscribe', function(req, res){
	var name = req.body.name, email = req.body.email, desc = req.body.desc;
	signUp(name,email, desc, function(err, result){
		if(err){
			res.locals.signerror="error";
			res.redirect('http://optimizemichigan.org');
			return;
		}
		res.locals.signerror="success";
		res.redirect('http://optimizemichigan.org');
	});
});

app.get('/teams', function (req, res) {
	var fs = require('fs');
	var obj;
	fs.readFile('./app/data/teams.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  obj = JSON.parse(data);
		res.render('team', {css_file:'teams', teams:obj});
	});
});

renderCorrectPage('/optimizeteam','optimizeteam');
renderCorrectPage('/about','about');
renderCorrectPage('/sponsors','sponsors');
renderCorrectPage('/story','story');
renderCorrectPage('/friends', 'friends');
renderCorrectPage('/social','social');
renderCorrectPage('/courses','courses');
renderCorrectPage('/resources', 'resources');

app.use(function(req, res) {
 res.send('Sorry the page your are looking for doesn\'t exist. '+
 '<br><a href="http://www.optimizemichigan.org">Please go to our homepage at optimizeMichigan.org', 404);
});

http.createServer(app).listen(app.get('port'), ipaddress, function(){
  console.log("Express server listening on port " + app.get('port'));
});
