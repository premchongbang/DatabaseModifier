var exports= module.exports={};

module.exports={
	isDateValid: function(date){
		//console.log(date);
		var date_regex = /^(0[1-9]|[12][0-9]|3[01])[- \/.](0[1-9]|1[012])[- \/.](19|20)\d\d$/ ;

		if(!(date_regex.test(date))) {
			return false;
		} else {
			return true;
		}
	},
	isDateInValidOrder: function(start, end){
		var startDate = new Date(this.reverseDate(start));
		var endDate = new Date(this.reverseDate(end));
		var currDate = new Date();

		if(startDate <= endDate){
			return true;
		} else {
			//console.log("its false " + startDate + " " + endDate);

			return false;
		}
	},
	reverseDate: function(date){
		var arr = date.split("/");
	    var str = "";
	    
	    var arrLength = arr.length -1;
	    for(i = arrLength; i >= 0; i--){
	    	if(i == 0){
	        	str += arr[i];
	        } else {
	    		str += arr[i] + "-";
	        }
	    }
	    return str;
	}
}