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

	pool2.connect().then(client => {
		client.query('SELECT * FROM site_information;').then(res => {
		client.release()
		
		for (i = 0; i < res.rows.length; i++) { 
			var data = res.rows[i];
    		sendPackage[i] = data;
		};

		})
		.catch(e => {
		client.release()
		console.error('query error', e.message, e.stack)
		})
	})
	.catch(e => {
		console.error('connection error', e.message, e.stack)
	})

	res.render('index.html');
});

app.post('/newEntry', function (req, res) {
	var company = req.body.company;
	var site = req.body.site;
	var mainSite = req.body.mainSite;
	var notes = req.body.notes;
	var phnum = req.body.phNumber;
	var startDate = req.body.startDate;
	var endDate = req.body.endDate;

	// validating data
	if(company.replace(/\s/g, '') == "" || site.replace(/\s/g, '') == "" || mainSite == "" || phnum == "" || !servercode.isDateValid(startDate) || !servercode.isDateValid(endDate) || !servercode.isDateInValidOrder(startDate, endDate)) {
		console.log("Empty or Unacceptable data format.");
	} else {
		if(mainSite.toLowerCase() == "yes" || mainSite.toLowerCase() == "no"){
			var customQuery = "INSERT INTO site_information (company, site, main_site, Notes, phone_number, start_date, end_date) VALUES ('"+ 
																																company +"', '"+ site +"', '"+ 
																																mainSite +"', '"+ notes +"', '"+ 
																																phnum +"', '"+ startDate +"', '"+ 
																																endDate +"');";

			pool2.connect().then(client => {
				client.query(customQuery).then(res => {
				client.release()
				
				for (i = 0; i < res.rows.length; i++) { 
		    		sendPackage[i] = res.rows[i];
				};

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
				var customQuery = "";
				var id = parseInt(k) - 1;
				console.log("key count " + k);
				// creating query by extracting data

				var company = obj[k][1].trim();
				var site = obj[k][2].trim();
				var mainSite = obj[k][3].trim() ;
				var notes = obj[k][4].trim();
				var phnum = obj[k][5].trim() ;
				var startDate = obj[k][6].trim() ;
				var endDate = obj[k][7].trim();

				//data validation
				if(company == "" || site == "" || mainSite == "" || phnum == "" || !servercode.isDateValid(startDate) || !servercode.isDateValid(endDate) || !servercode.isDateInValidOrder(startDate, endDate) || mainSite == ""){
					console.log("Empty or Unacceptable data format.");
				} else {
					if(mainSite.toLowerCase() == "yes" || mainSite.toLowerCase() == "no"){

						customQuery = "UPDATE site_information SET company = '" + company + 
																"', site='" + site + 
																"', main_site='" + mainSite+ 
																"', notes='" +  notes + 
																"',phone_number='" + phnum + 
																"',start_date='" + startDate + 
																"',end_date='" + endDate + 
																"' WHERE id = " + obj[k][0].trim() + ";";

						var result = await client.query(customQuery);
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
				console.log("key length " + obj[k].length);
				for(i =0; i < obj[k].length; i++) {
			
					var customQuery = "DELETE FROM site_information WHERE ID = '" + obj[k][i] + "';";
			
					var result = await client.query(customQuery);
				}
			}
			console.log(customQuery);
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
