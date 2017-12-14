var express = require('express');
var path = require('path');
var cons = require('consolidate');
var Pool = require('pg-pool');
var bodyParser = require('body-parser');
var servercode = require('./public/js/helper.js');

var app = express();

// to support JSON-encoded bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// configuration to installed `pg` version
var pool = new Pool()

var pool2 = new Pool({
				database: 'ustdb',
				user: 'postgres',
				password: 'Prawnfish1627',
				port: 5433,
				ssl: false,
				max: 20, // set pool max size to 20 
				min: 4, // set min pool size to 4 
				idleTimeoutMillis: 1000, // close idle clients after 1 second 
				connectionTimeoutMillis: 1000, // return an error after 1 second if connection could not be established 
})

// socket io connection
var server = require('http').Server(app);
var io = require('socket.io')(server);

// using static middleware to access the folders
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// view engine setup
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

//setting port 
app.set('port', process.env.PORT || 8081);

var sendPackage = [];

// This responds with "Hello World" on the homepage
app.get('/', function (req, res) {
	(async () => {
		var pool = new Pool()
		var client = await pool2.connect()
		try {
			var customQuery = 'SELECT * FROM site_information;';

			var res = await client.query(customQuery);
				
			for (i = 0; i < res.rows.length; i++) { 
				var data = res.rows[i];
	    		sendPackage[i] = data;
			};
		} finally {
	    	client.release()
	  	}
	})().catch(e => console.error(e.message, e.stack))

	res.render('index.html');
});

//gets data
app.get('/getData', function (req, res) {
	(async () => {
		var pool = new Pool()
		var client = await pool2.connect()
		try {
			var customQuery = 'SELECT * FROM site_information;';

			var res = await client.query(customQuery);
				
			for (i = 0; i < res.rows.length; i++) { 
				var data = res.rows[i];
	    		sendPackage[i] = data;
			};
		} finally {
	    	client.release()
	  	}
	})().catch(e => console.error(e.message, e.stack))
	
	res.send(sendPackage);
});

app.post('/newEntry', function (req, res) {
	var company = req.body.company.trim();
	var site = req.body.site.trim();
	var mainSite = req.body.mainSite.trim();
	var notes = req.body.notes.trim();
	var phnum = req.body.phNumber.trim();
	var startDate = req.body.startDate.trim();
	var endDate = req.body.endDate.trim();

	// validating data
	if(company == "" || site == "" || mainSite == "" || isNaN(phnum) || !servercode.isDateValid(startDate) || !servercode.isDateValid(endDate) || !servercode.isDateInValidOrder(startDate, endDate)) {
		console.log("Empty or Unacceptable data format.");
	} else {
		if(mainSite.toLowerCase() == "true" || mainSite.toLowerCase() == "false"){
			var customQuery = "INSERT INTO site_information (company, site, main_site, Notes, phone_number, start_date, end_date) VALUES ('"+ 
																																company +"', '"+ site +"', '"+ 
																																mainSite +"', '"+ notes +"', '"+ 
																																phnum +"', '"+ startDate +"', '"+ 
																																endDate +"');";
			console.log(customQuery);

			pool2.connect().then(client => {
				client.query(customQuery).then(res => {
					client.release()
				})
				.catch(e => {
					client.release()
					console.error('query error', e.message, e.stack)
				})
			})
			.catch(e => {
				console.error('connection error', e.message, e.stack)
			})
		} else {
			console.log("Empty or Unacceptable data format.");
		}
	}

	return res.redirect('/');
});

app.post('/updateDB', function (req, res) {
	var obj = req.body;

	// supports asynchronous operation
	(async () => {
		var pool = new Pool()
		var client = await pool2.connect()
		try {
		  	for (var k in obj) {
				var objLength = obj[k].length;
				
				//console.log("key count " + objLength);
				// creating query by extracting data

				var id =  parseInt(obj[k][0].trim());
				var company = obj[k][1].trim();
				var site = obj[k][2].trim();
				var mainSite = obj[k][3].trim() ;
				var notes = obj[k][4].trim();
				var phnum = obj[k][5].trim() ;
				var startDate = obj[k][6].trim() ;
				var endDate = obj[k][7].trim();

				//data validation
				if(company == "" || site == "" || mainSite == "" || isNaN(phnum) || !servercode.isDateValid(startDate) || !servercode.isDateValid(endDate) || !servercode.isDateInValidOrder(startDate, endDate) || mainSite == ""){
					console.log("Empty or Unacceptable data format.");
				} else {
					if(mainSite.toLowerCase() == "true" || mainSite.toLowerCase() == "false"){

						var customQuery = "UPDATE site_information SET company = '" + company + 
																"', site='" + site + 
																"', main_site='" + mainSite+ 
																"', notes='" +  notes + 
																"',phone_number='" + phnum + 
																"',start_date='" + startDate + 
																"',end_date='" + endDate + 
																"' WHERE id = " + id + ";";

						await client.query(customQuery);
					} else {
						console.log("Boolean value wrong");
					}
				}
			}
		} finally {
	    	client.release()
	  	}
	})().catch(e => console.error(e.message, e.stack))
	
	return res.redirect('/');
});

app.post('/deleteDB', function(req, res){
	var obj = req.body;

	// supports asynchronous operation
	(async () => {
		var pool = new Pool()
		var client = await pool2.connect()
	  	try {
	  		for(var k in obj) {
	  			var len = obj[k].length;
	  			var customQuery = "";
				console.log("key length " + len);

				if(len <= 1){
					customQuery = "DELETE FROM site_information WHERE ID = '" + obj[k][0] + "';";
				} else {
					var ids = "";

					for(i = 0; i < len; i++) {
						if(i == len - 1){
							ids += "'" +obj[k][i] + "'";
						} else {
							ids += "'" +obj[k][i] + "', ";
						}
					}
					customQuery = "DELETE FROM site_information WHERE ID IN (" + ids + ");";
				}

				await client.query(customQuery);

				console.log(customQuery);
			}
		} finally {
    		client.release()
  		}
		})().catch(e => console.error(e.message, e.stack))

	return res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.type('text/html');
	res.status(200);
});

io.on('connection', function(socket){
	console.log('User Connected');
	socket.emit('db', sendPackage);
	sendPackage = [];
	socket.on('disconnect', function(){
		console.log('User Disconnected');
	});
});

server.listen(app.get('port'), function(){
	console.log('Server listening at port ' + app.get('port'));
});

module.exports = app;
