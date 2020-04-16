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

	// check whether to omit session login/logout create/edit navlinks
	if(getCookie('uniqueid') == null){
		$(".session-logout_lnk").addClass("d-none");
		$(".session-edit_lnk").addClass("d-none");
	} else {
		$(".session-login_lnk").addClass("d-none");
		$(".session-create_lnk").addClass("d-none");
	}

	function sessionCreate(length) { //better alg?
		//Math.random().toString(36).substr(2, length)
		var result           = '';
		var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for ( var i = 0; i < length; i++ ) {
		   result += characters.charAt(Math.floor(Math.random() * charactersLength)); //Math.random() predictable?
		}
		var dest = document.getElementById("create-session-id").value=result;
		create_cookie("uniqueid", dest);
		return dest;
	}
	// wrapping this in an if statement so it does not break js on other pages
	if($("#create-session-title").length){sessionCreate(8);}
	 
	$("#degreeaddinputGroupSelect-3").on('keyup', function(){
		$(this).val(sanatize($(this).val().replace(/[a-z]/gi,'')));
	});	
	// auto complete for courses
    $('#completed-courses').on('keypress', '.add-course-input', function(e) {
    	// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view course
		$(this).autocomplete({
		    lookup: function (query, done) {
				var result;
		        $.post("/administration/autoSearchCourse/js/", //need to change later to have student have their own url path
			    {
			      courseSearchText: sanatize(searchText)
				},
			    function(data,status) {
					if(data.length > 1) {
						suggestions = [];
						var k = 0;
						for(var i = 1; i < data.length; i++){
							suggestions[k] = {};
							suggestions[k]["value"] = data[i].CourseDept + " " +  data[i].CourseID + "-"+ data[i].CourseName + "-" + data[i].ID;
							k++;
						}

						result = { suggestions };
						done(result);

					} else {
						result = { suggestions: [] };
						done(result);
					}
				});
		    },
		    onSelect: function (suggestion) {
		        $(this).val(suggestion["value"].split("-")[0].trim());
		        $(this).attr("course-id", suggestion["value"].split("-")[2].trim());
		    }
		});
	});

    // add course iD if user manually enters course
	$('#completed-courses').on('focusout', '.add-course-input', function(e) {
		// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
     	var thisInputElement = $(this);
     	$.post("/administration/view-course/js/", //need to change later to have student have their own url path
	    {
	      courseSearchText: sanatize(searchText)
		},
	    function(data,status) {
			if(!$.isEmptyObject(data)) {
				$(thisInputElement).attr("course-id", data.ID);
			} else {
				$(thisInputElement).attr("course-id", "");
			}
		});
	});

    // also capture enter key to trigger above function
    $("#degreeaddinputGroupSelect-4").keypress(function(e) {
        if(e.which == 13) { $("#add-degree-submit-btn").click(); }
    });

    // for adding degree Categories
    $(document).on("click", "#add-course-btn", function(e) {
    	var html = '<tr>'+
    	           '<td>' +
    			   '<div class="add-course input-group mt-2 mb-2 ml-5">' +
    			   '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: .5em;">' +
    			   '<i class="fa fa-trash remove-course mr-1"></i>Course Name</span>' +
    			   '</div>' +
    			   '<input type="text" class="form-control add-course-input">' +
    			   '</div>' +
    			   '</td>' +
    	           '</tr>';
    	$("#completed-courses").append(html);
    });

    $(document).on("click", ".remove-course", function(e) {
    	$(this).parent().parent().parent().remove();
    });

	  // force uppercase letters only
	  $("#view-course-search-input").on('keyup', function(){
	    $(this).val(sanatize($(this).val().toUpperCase()));
	});

	// auto complete search for degrees
	$('#search-degree').on('keypress' , function(e) {
		var searchText = sanatize($(this).val().trim());
	   // auto complete search degrees
	   $(this).autocomplete({
		   lookup: function (query, done) {
			   var result;
			   $.post("/administration/autoSearchDegree/js/", //need to change later to have student have their own url path
			   {
				   degreeSearchText: sanatize(searchText)
			   },
			   function(data,status) {
				   if(data.length > 1) {
					   suggestions = [];
					   var k = 0;
					   for(var i = 1; i < data.length; i++){
						   suggestions[k] = {};
						   suggestions[k]["value"] = data[i].DegreeName + " - " + data[i].CatalogYear;
						   k++;
					   }

					   result = { suggestions };
					   done(result);

				   } else {
					   result = { suggestions: [] };
					   done(result);
				   }
			   });
		   },
		   onSelect: function (suggestion) {
			   $("#view-degree-search-input").val(suggestion["value"].split("-")[0].trim());
			   $("#view-degree-search-btn").click();
		   }
	   });
	});
	$(document).on("click", "#session-submit-btn", function(e) {

		var jsonResponse = {};
		jsonResponse["Categories"] = {};
		jsonResponse["Categories"]["courses"] = [];

		$('.add-course').each(function(catIndex) {
			//var category = sanatize($(this).children("input").eq(0).val().trim());
			//var requireNumCourses = parseInt(sanatize($(this).children("input").eq(1).val().trim()));

			//jsonResponse["Categories"][catIndex] = {};
			//jsonResponse["Categories"][catIndex]["name"] = category;
			//jsonResponse["Categories"][catIndex]["courses"] = [];

			// $(this).children(".add-course-input").children("tr").each(function(couIndex) {
			// 	var coursePKID = sanatize($(this).children().children().children("input").attr("course-id").trim());
			// 	jsonResponse["Categories"][catIndex]["courses"][couIndex] = parseInt(coursePKID);
			// });

			//jsonResponse["Categories"][catIndex]["coursesRequired"] = parseInt(requireNumCourses);
			jsonResponse["Categories"]["courses"][catIndex] = parseInt(sanatize($(this).children(".add-course-input").attr("course-id").trim()));

		});

		var hi = document.getElementById("create-session-id").value;
		console.log(hi);

		hi = document.getElementById("create-session-pin").value;
		console.log(hi);

		hi = document.getElementById("search-degree").value;
		console.log(hi);

		hi = JSON.stringify(jsonResponse);
		console.log(hi);
    	// send request to the back-end...
		$.post("/session/studentCreateSession/",
   		{
   			sessionID: sanatize($("#create-session-id").val().trim()),
   			sessionPIN: parseInt(sanatize($("#create-session-pin").val().trim())),
			sessionDegree: sanatize($("#search-degree").val().trim()),
			sessionInfo: JSON.stringify(jsonResponse)
		},   
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#add-degree-submit-alert").removeClass("alert-danger");
				$("#add-degree-submit-alert").addClass("alert-success");
				$("#add-degree-submit-alert").text(data.message);
				$("#add-degree-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#session-submit-btn").offset().top -20,
				    scrollLeft: $("#session-submit-btn").offset().left -20
				});
   			} else {
   				$("#add-degree-submit-alert").removeClass("alert-success");
				$("#add-degree-submit-alert").addClass("alert-danger");
				$("#add-degree-submit-alert").text(data.message);
				$("#add-degree-submit-alert").removeClass("d-none");
   			}
   		});
    });

    /*-----------------------login session js----------------------------------------- */
    $(document).on("click", "#session-login-btn", function(e) {
		$.post("/session/checkUserExistence/",
   		{
   			sessionid: sanatize($("#login-session-id").val().trim()),
   			pin: parseInt(sanatize($("#login-session-pin").val().trim()))
		},   
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1){
   				$("#session-login-submit-alert").removeClass("alert-danger");
				$("#session-login-submit-alert").addClass("alert-success");
				$("#session-login-submit-alert").text(data.message);
				$("#session-login-submit-alert").removeClass("d-none");
				window.location.replace("/session/edit/");
   			} else {
   				$("#session-login-submit-alert").removeClass("alert-success");
				$("#session-login-submit-alert").addClass("alert-danger");
				$("#session-login-submit-alert").text(data.message);
				$("#session-login-submit-alert").removeClass("d-none");
   			}
   		});
	});


	/*-----------------------logout session js----------------------------------------- */
	$(document).on("click", ".session-logout_lnk", function(e) {
		erase_cookie("uniqueid");
		window.location.replace("/session/login/");
	});

	/*-----------------------edit session js----------------------------------------- */
	if($("#edit-session-title").length){
		// check if session is valid,
		// otherwise send to create session
		if(getCookie('uniqueid') == null){
			// send user to create session page
			window.location.replace("/session/create/");
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

	$(document).on("click", "#session-update-btn", function(e) {
		// TODO: back-end connection for updating session variables
		$("#edit-session-update-alert").removeClass("alert-danger");
		$("#edit-session-update-alert").addClass("alert-success");
		$("#edit-session-update-alert").text("Session Updated Successfully!");
		$("#edit-session-update-alert").removeClass("d-none");

	});




});