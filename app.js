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

function renderCorrectPage(path, page){
	app.get(path, function(req, resp){
		resp.render(page);
	});
}

renderCorrectPage('/','index');
// renderCorrectPage('/optimizeteam','optimizeteam');
// renderCorrectPage('/about','about');
// renderCorrectPage('/team','team');
// renderCorrectPage('/sponsors','sponsors');
// renderCorrectPage('/story','story');
// renderCorrectPage('/friends', 'friends');
// renderCorrectPage('/social','social');
// renderCorrectPage('/courses','courses');
// renderCorrectPage('/resources', 'resources');

app.use(function(req, res) {
 res.send('Sorry the page your are looking for doesn\'t exist.'
 	+'<a href="http://www.optimizemichigan.org">Please go to our homepage at optimizeMichigan.org', 404);
});
		
http.createServer(app).listen(app.get('port'), ipaddress, function(){
  console.log("Express server listening on port " + app.get('port'));
});
