var exports= module.exports={};

module.exports={
	isDateValid: function(date){
		console.log(date);
		var date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/ ;

		if(!(date_regex.test(date))) {
			return false;
		} else {
			return true;
		}
	},
	isDateInValidOrder: function(date1, date2){
		var date1 = new Date(date1);
		var date2 = new Date(date2);

		if(date1 <= date2){
			return true;
		} else {
			return false;
		}
	}
}