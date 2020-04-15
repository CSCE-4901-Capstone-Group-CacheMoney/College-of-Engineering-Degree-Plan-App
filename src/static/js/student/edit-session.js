$(document).ready(function() {
	// grab the csrf cookie token and setup ajax request header
	var csrftoken = getCookie('csrftoken');
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});

	if($("#edit-session-title").length){
		// check if session is valid,
		// otherwise send to create session
		if(getCookie('sessionidtest') == null){
			// send user to create session page
			window.location.replace("/session/");
		} else {
			// TODO: ajax call to get session variables, for now hard code it....
			$("#edit-session-pin").val("1234");
			$("#search-degree").val("Computer Science - 2020");

			for(var i = 0; i < 5; i++){
				var html = '<tr>'+
    	           '<td>' +
    			   '<div class="add-course input-group mt-2 mb-2 ml-5">' +
    			   '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: .5em;">' +
    			   '<i class="fa fa-trash remove-course mr-1"></i>Course Name</span>' +
    			   '</div>' +
    			   '<input type="text" class="form-control add-course-input" value="CSCE 1030">' +
    			   '</div>' +
    			   '</td>' +
    	           '</tr>';
    			$("#completed-courses").append(html);
			}
		}

	}

});