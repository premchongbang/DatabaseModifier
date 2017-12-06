var socket = io.connect();
var storeIndex = []; // stores table row index
var data = []; // stores incoming data from server-side

// get ragional ratings
socket.on('db', function(incomingData){
	console.log("Socket emit");
	data = [];
	data = incomingData;
	console.log(data.length);
});

$(document).ready(function() {
    $('#btnGet').on('click', function() {	
<<<<<<< HEAD
    	//console.log(" Data length " + data.length);
    	var counter = 0;

    	$.get('/getdata', function(result){
    		console.log("Incoming Data length " + result.length);
    		if(result.length != 0 && result.length != data.length){
    			data = result;
    			$("#info").text("Updated Version");
    		}

    		//console.log("New Data length " + data.length);
		    	
		    $('#datatbl tbody').empty();

			$.each(data, function(rowIndex, r) {
			    var row = $("<tr/>");
			    var bool = true;
			    $.each(r, function(colIndex, c) {
			    	if(bool){
			    		row.append($("<td/>").prepend('<input type="checkbox" name="cb" value="' + c + '"/>'));
			    		row.append($("<td/>").text(c));
			    		bool = false;
			    	} else {
			    		row.append($("<td/>").text(c));
			    	}
			    });
			    $('#tblbody').append(row);
			});
    	});
=======
    	console.log(" Data length " + data.length);
    	var counter = 0;
    	
    	$('#datatbl tbody').empty();

		$.each(data, function(rowIndex, r) {
		    var row = $("<tr/>");
		    var bool = true;
		    $.each(r, function(colIndex, c) {
		    	if(bool){
		    		row.append($("<td/>").prepend('<input type="checkbox" name="cb" value="' + c + '"/>'));
		    		row.append($("<td/>").text(c));
		    		bool = false;
		    	} else {
		    		row.append($("<td/>").text(c));
		    	}
		    });
		    $('#tblbody').append(row);
		});
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
	});

	$("#btnDelete").click(function(){
		var delPackage ={};

		var checkedValues = $('input:checked').map(function() {
    		return this.value;
		}).get();

		if(checkedValues.length > 0) {
			delPackage["id"] = checkedValues;

			$.ajax({
	      		type : 'POST',
	      		url : '/deleteDB',
	      		headers : {'Content-Type' : 'application/json'},
	      		data : JSON.stringify(delPackage),
<<<<<<< HEAD
	      		success: function(result){

=======
	      		success : function(result) {
	      			window.alert("Action Completed");
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
	      		}
	    	}).done(function(){
	    		window.location.reload();
	    	});
		} else {
			window.alert("No data selected.");
		}

		$('#btnUpdate').prop('disabled', true);
<<<<<<< HEAD
=======
		window.location.reload();
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
	});

// convert table cell into textbox when double clicked
	$('#tblbody').on('dblclick', 'td', function() {
		var $this = $(this);

		// freezing index value
		if($this.index() > 1){
			var $input = $('<input>', {
			value: $this.text(),
			type: 'text',
			blur: function() {
				$this.text(this.value);
			},
			keyup: function(e) {
			   		if (e.which === 13) $input.blur();
				}
			})
			.appendTo( $this.empty() ).focus();
		}
	});

// get table first row value
	$("#tblbody").on('change', 'td', function(){
		var $this = $(this);
		$('#btnUpdate').prop('disabled', false);

		var i = $this.parent().index();
<<<<<<< HEAD
		//console.log("clicked index " + i);
=======
		console.log("clicked index " + i);
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
		storeIndex.push(i);
	})

// updating the table row
	$("#btnUpdate").click(function(){
		var uniqueIndex = getUniqueRowIndex(storeIndex);

		// stores changed data
		var storeData = getRowData(uniqueIndex);

		$.ajax({
      		type : 'POST',
      		url : '/updateDB',
      		headers : {'Content-Type' : 'application/json'},
<<<<<<< HEAD
      		data : JSON.stringify(storeData)
    	}).done(function(){
  			storeIndex = [];
  			$('#btnUpdate').prop('disabled', true);
			window.location.reload();
=======
      		data : JSON.stringify(storeData),
      		success : function(result) {
      			window.alert("Action Completed");
      			storeIndex = [];
      			$('#btnUpdate').prop('disabled', true);
      			window.location.reload();
      		}
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
    	});
	});

	// checks for dublicates in an array
	function getUniqueRowIndex(li) {
		var result = [];

		$.each(li, function(i, e) {
			if ($.inArray(e, result) == -1) {
<<<<<<< HEAD
				//console.log("index " + e);
=======
				console.log("index " + e);
>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
				result.push(e);
			}
		});
		
		return result;
	}

	function getRowData(li){
		var store = {};
		var dbList = [];

		for(i = 0; i < li.length; i++){

			dbList = [];

		    var $row = $('#tblbody').find('tr').eq(li[i]);
		    var $tds = $row.find('td');

			dbList[0] = $tds.eq(1).text();
			dbList[1] = $tds.eq(2).text();
			dbList[2] = $tds.eq(3).text();
			dbList[3] = $tds.eq(4).text();
			dbList[4] = $tds.eq(5).text();
			dbList[5] = $tds.eq(6).text();
			dbList[6] = $tds.eq(7).text();
			dbList[7] = $tds.eq(8).text();

<<<<<<< HEAD
		    //console.log("check " + $tds.eq(1).text());

			store[i] = dbList;
		};

		return store;
	}

	var counter = 0;

	$('#btnAdd').click(function(){

=======
		    console.log("check " + $tds.eq(1).text());

			store[i] = dbList;
		};

		return store;
	}

	var counter = 0;

	$('#btnAdd').click(function(){

>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
		$('#btnAdd').prop('disabled', true);
		
		if(counter == 0) {
			counter++;
			var data = {
				'true': 'Yes',
				'false': 'No'
			}
<<<<<<< HEAD

			var s = $('<select />', { name: 'mainSite'});

			for(var val in data) {
				$('<option />', {value: val, text: data[val]}).appendTo(s);
			}

			$('#middle').after().append(
		        $('<form />', { action: '/newEntry', method: 'POST' }).append(
		            $('<input />', { name: 'company', placeholder: 'Company Name', type: 'text' }),
		            $('<input />', { name: 'site', placeholder: 'Site', type: 'text' }),
		            $(s),
		            $('<input />', { name: 'notes', placeholder: 'Note', type: 'text' }),
		            $('<input />', { name: 'phNumber', placeholder: 'Ph Number', type: 'text' }),
		            $('<input />', { name: 'startDate', placeholder: 'Start - dd-mm-yyyy', type: 'text' }),
		            $('<input />', { name: 'endDate', placeholder: 'End - dd-mm-yyyy', type: 'text' }),
		            $('<br />'),
		            $('<input />', { type: 'submit', id: 'submit', value: 'Submit' })
		        )
		    )
		}
	});

=======

			var s = $('<select />', { name: 'mainSite'});

			for(var val in data) {
				$('<option />', {value: val, text: data[val]}).appendTo(s);
			}

			$('#middle').after().append(
		        $('<form />', { action: '/newEntry', method: 'POST' }).append(
		            $('<input />', { name: 'company', placeholder: 'Company Name', type: 'text' }),
		            $('<input />', { name: 'site', placeholder: 'Site', type: 'text' }),
		            $(s),
		            $('<input />', { name: 'notes', placeholder: 'Note', type: 'text' }),
		            $('<input />', { name: 'phNumber', placeholder: 'Ph Number', type: 'text' }),
		            $('<input />', { name: 'startDate', placeholder: 'Start - dd-mm-yyyy', type: 'text' }),
		            $('<input />', { name: 'endDate', placeholder: 'End - dd-mm-yyyy', type: 'text' }),
		            $('<br />'),
		            $('<input />', { type: 'submit', id: 'submit', value: 'Submit' })
		        )
		    )
		}
	});

>>>>>>> f02e03f519e708af99ad1c3c161ec5e20c1e043e
	$('#submit').click(function(){
		counter--;
		$('#btnAdd').prop('disabled', false);
		window.location.reload();
	});
});