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
    $('.fetchData').on('click', function() {
    	
    	console.log(" Data length " + data.length);

        for(i = 0; i < data.length; i++){
            var clone = $('#template').clone(true).attr('id', '');
            clone.find('.cb').html('<input type="checkbox" name="cb" value="' + data[i].id + '"/>');
            clone.find('.id').html(data[i].id);
            clone.find('.company').html(data[i].company);
            clone.find('.site').html(data[i].site);
           	if(data[i].main_site == true){
            	clone.find('.mainSite').html('Yes');
        	}else {
        		clone.find('.mainSite').html('No');
        	};
            clone.find('.notes').html(data[i].notes);
            clone.find('.phNumber').html(data[i].phone_number);
            clone.find('.startDate').html(data[i].start_date);
            clone.find('.endDate').html(data[i].end_date);
        	clone.appendTo('table');
    	}
    	$('#btnGet').prop('disabled', true);
	});
});

$(function(){
	$("button[name='del']").click(function(){
		var delPackage ={};

		var checkedValues = $('input:checked').map(function() {
    		return this.value;
		}).get();

		for(i =0; i < checkedValues.length; i++){
			console.log("cb test " + checkedValues[i]);
		}

		if(checkedValues.length > 0) {
			delPackage["id"] = checkedValues;

			$.ajax({
	      		type : 'POST',
	      		url : '/deleteDB',
	      		headers : {'Content-Type' : 'application/json'},
	      		data : JSON.stringify(delPackage),
	      		success : function(result) {
	      			$('#btnUpdate').prop('disabled', true);
	      			window.alert("Data Deleted.");
	      			location.reload();
	      		}
	    	});
		} else {
			$('#btnUpdate').prop('disabled', true);
			window.alert("No data selected.");
			location.reload();
		}

	});
});
$(function(){
	$('#tblData td').on('dblclick', function() {
		var $this = $(this);
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
	});
});

// get table first row value
$(function(){
	$("#tblData td").on('change', function(){
		var $this = $(this);
		$('#btnUpdate').prop('disabled', false);

		var i = $this.parent().index();

		storeIndex.push(i);
	})
});

// updating the table row
$(function(){
	$("button[name='update']").click(function(){
		var uniqueIndex = getUniqueRowIndex(storeIndex);

		// stores changed data
		var storeData = getRowData(uniqueIndex);

		$.ajax({
      		type : 'POST',
      		url : '/updateDB',
      		headers : {'Content-Type' : 'application/json'},
      		data : JSON.stringify(storeData),
      		success : function(result) {
      			$('#btnUpdate').prop('disabled', true);
      			window.alert("Database Modified.");
      			location.reload();
      		}
    	});
	});
});

// checks for dublicates in an array
function getUniqueRowIndex(li) {
	var result = [];

	$.each(li, function(i, e) {
		if ($.inArray(e, result) == -1) {
			console.log("index " + e);
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
		var actualIndex = "";

		// splitting string and storing it as an array
		var rowContent = $( 'table tr' ).eq(li[i]).text().split("\n");
		
		for(j = 2; j < (rowContent.length - 1); j++){
			actualIndex = rowContent[2];
			dbList.push(rowContent[j]);
		}

		store[actualIndex] = dbList;
	};

	console.log(" store keys " + Object.keys(store));

	return store;
}