var express = require('express'),
	http = require('http'),
	app = express(),
	ipaddress = process.env.OPENSHIFT_NODEJS_IP,
	port = process.env.PORT || 8000;
var bodyParser = require('body-parser')

if (typeof ipaddress === "undefined") {
	ipaddress = "127.0.0.1";
	console.warn('No OPENSHIFT_NODEJS_IP var, using ' + ipaddress + ':8000');
}
//console.log(__dirname);

app.set('views', 'app/jade/jadepages');
app.set('view engine', 'jade');
app.set('port', port);
app.use('/', express.static('app/'));
app.use(bodyParser.json());

function render(path, page){
	app.get(path, function(req, resp){
		resp.render(page);
	});
}

function signUp(name, email, desc, callback){
	var MailChimpAPI = require('mailchimp').MailChimpAPI,
		API_KEY = 'feff5c1e72c5294f3a3564f2c5c42386-us6',
		LIST_ID = '7a6ce43042';
	var api = new MailChimpAPI(API_KEY , { version : '1.3', secure : false }),
		names = name.split(' '), status,
		data = {
			apikey: API_KEY,
			id: LIST_ID,
			email_address : email,
			merge_vars: {'FNAME': names[0], 'LNAME': names[1], 'MMERGE3' : desc},
			double_optin: false,
			send_welcome: true
		};
	 api.listSubscribe(data, function(error, result) {
		if (error) {
			console.log(error);
			callback(error);
		} else {
			callback(null, result);
		}
	});
}

//cache set
app.use(express.static(__dirname + '/imgs', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/css', { maxAge: 86400000 }));
app.use(express.static(__dirname + '/js', { maxAge: 86400000 }));

render('/','index');

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

// Paths with matching pages in ./app/jade/jadepages
render('/optimizeteam','optimizeteam');
render('/about','about');
render('/teams','teams');
render('/past-teams', 'past-teams');
render('/sponsors','sponsors');
render('/story','story');
render('/friends', 'friends');
render('/social','social');
render('/courses','courses');
render('/resources', 'resources');

// 404 page in ./app/jade/jadepages
app.use(function(req, res) {
	res.render('error');
});

// Start the server
http.createServer(app).listen(app.get('port'), ipaddress, function(){
	console.log("Express server listening on port " + app.get('port'));
});
