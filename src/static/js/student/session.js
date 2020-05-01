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
		$(".session-view-degree_lnk").addClass("d-none");
		$(".session-view-timeline_lnk").addClass("d-none");
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
		return dest;
	}
	// wrapping this in an if statement so it does not break js on other pages
	if($("#create-session-title").length){
		sessionCreate(8);
		$('#search-degree').val('');
        document.getElementById("radio-spring").checked = false;
        document.getElementById("radio-fall").checked = false; //ensure that all fields are deleted on page refresh
        $('#session-submit-btn').prop('disabled', true);; //by default, disable the submit button
        var myInput = document.getElementById("create-session-pin");
        var mySearch = document.getElementById("search-degree");
        var myHours = document.getElementById("create-semester-hours");
        var isSearchSatisfied = false;
        var isPinFilled = false;
        var isPinSatisfied = false;
        var isSemesterSatisfied = false;
        var isHoursSatisfied = false;
        //when the user clicks off the input for colleges, display field required if left empty AND disable the button
        //TODO: have backend check if the college the user enters actually exists
        mySearch.onkeyup = function() {
            $(mySearch).each(function() {  
                if($(this).val().trim().length == 0){
                    $(this).attr("placeholder", "Field Required");
                    isSearchSatisfied = false;
                }
                else{
                    isSearchSatisfied= true;
                }
            })
            check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
        }
        // when the user clicks on the password field, show the message
        myInput.onfocus = function() {
          document.getElementById("message").style.display = "block";
        }
        
        // when the user clicks outside of the password field, hide the message. if it is empty, display field requried AND disable the button
        myInput.onblur = function() {
            document.getElementById("message").style.display = "none";
            $(myInput).each(function() {  
                if($(this).val().trim().length == 0){
                    $(this).attr("placeholder", "Field Required");
                    isPinFilled = false;
                }
            })
            check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
        }
        myInput.onkeyup = function() {
            // validate length
            if(myInput.value.length == 4) {
                $("#length").removeClass("fa fa-times invalid");
                $("#length").addClass("fa fa-check valid");
                isPinFilled = true;
            } 
            else{
                $("#length").removeClass("fa fa-check valid");
                $("#length").addClass("fa fa-times invalid");
                isPinFilled = false;
            }   
            // validate numbers
            if(myInput.value.match(/^[0-9]+$/) != null) { //checks at all points if the entire string has no alphas, will fail if alphas are included
                $("#number").removeClass("fa fa-times invalid");
                $("#number").addClass("fa fa-check valid");
                isPinSatisfied = true;
            } 
            else {
                $("#number").removeClass("fa fa-check valid");
                $("#number").addClass("fa fa-times invalid");
                isPinSatisfied = false;
            }
            check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
        }
        $('#radio-spring, #radio-fall').click(function () { //if a user clicks a button, the restriction for the statment is lifted
            isSemesterSatisfied = true;
            check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
        })
        myHours.onkeyup = function() {
            $(myHours).each(function() {  
                if($(this).val().trim().length == 0){
                    $(this).attr("placeholder", "Field Required");
                    isHoursSatisfied = false;
                }
                else{
                    isHoursSatisfied= true;
                }
            })
            check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
        }
        function check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied) //a non-elegant way of checking the conditions every user action
        {
            if((isPinSatisfied && isPinFilled && isSearchSatisfied && isSemesterSatisfied && isHoursSatisfied) == true){
                $('#session-submit-btn').prop('disabled', false);
            }
            else{
                $('#session-submit-btn').prop('disabled', true);
            }
            //console.log("pinsat " + isPinSatisfied)
            //console.log("pinfilled " + isPinFilled)
            //onsole.log("search " + isSearchSatisfied)
            //console.log("radio " + isSemesterSatisfied)
        }
	}
	 
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
							suggestions[k]["value"] = data[i].CourseDept + " " +  data[i].CourseID + " " + data[i].CourseName;
							suggestions[k]["fullcoursecode"] = data[i].CourseDept + " " +  data[i].CourseID;
							suggestions[k]["courseid"] = data[i].ID;
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
		        $(this).val(suggestion["fullcoursecode"]);
		    	$(this).attr("course-id", parseInt(suggestion["courseid"]));
		    }
		});
	});

    // add course iD if user manually enters course
	$('#completed-courses').on('focusout', '.add-course-input', function(e) {
		// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
     	var thisInputElement = $(this);
     	// temp turning this off as it is causing issues
	    // with adding course IDs to json
  //    	$.post("/administration/view-course/js/", //need to change later to have student have their own url path
	 //    {
	 //      courseSearchText: sanatize(searchText)
		// },
	 //    function(data,status) {
		// 	if(!$.isEmptyObject(data)) {
		// 		$(thisInputElement).attr("course-id", data.ID);
		// 	} else {
		// 		$(thisInputElement).attr("course-id", "");
		// 	}
		// });
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
    			   '<input type="text" class="form-control add-course-input" autocomplete="off">' +
    			   '</div>' +
    			   '</td>' +
    	           '</tr>';
    	$("#completed-courses").append(html);
    });

    $(document).on("click", ".remove-course", function(e) {
    	$(this).parent().parent().parent().parent().parent().remove();
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
						   suggestions[k]["degreeid"] = data[i].ID;
						   suggestions[k]["degreename"] = data[i].DegreeName;
						   suggestions[k]["catalogyear"] = data[i].CatalogYear;
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
				$("#search-degree").val(suggestion["value"]);
				$("#search-degree").attr("verify", suggestion["value"]);
		        $("#search-degree").attr("degree-id", parseInt(suggestion["degreeid"]));
		   }
	   });
	});
	$(document).on("click", "#session-submit-btn", function(e) {

		var jsonResponse = {};
		jsonResponse["Categories"] = {};
		jsonResponse["Categories"]["courses"] = [];


	/*-----------------------create session js----------------------------------------- */
		$('.add-course').each(function(catIndex) {
			jsonResponse["Categories"]["courses"][catIndex] = parseInt(sanatize($(this).children(".add-course-input").attr("course-id").trim()));
		});

    	// send request to the back-end...
		$.post("/session/studentCreateSession/",
   		{
   			sessionID: sanatize($("#create-session-id").val().trim()),
   			sessionPIN: sanatize($("#create-session-pin").val().trim().toString()),
			sessionDegreeID: parseInt(sanatize($("#search-degree").attr("degree-id"))),
			sessionInfo: JSON.stringify(jsonResponse),
			semesterOption: sanatize($("input[name='inlineRadioOptions2']:checked").val()),
			semesterHours: sanatize($("#create-semester-hours").val().trim()),
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
				create_cookie("uniqueid", sanatize($("#create-session-id").val().trim()));
				create_cookie("uniquepin", sanatize($("#create-session-pin").val().trim().toString()));
				create_cookie("degreeid", $("#search-degree").attr("degree-id"));
				setTimeout(function() {
			        window.location.replace("/session/edit/");
			    }, 1200);
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
   			pin: sanatize($("#login-session-pin").val().trim().toString())
		},   
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1){
   				$("#session-login-submit-alert").removeClass("alert-danger");
				$("#session-login-submit-alert").addClass("alert-success");
				$("#session-login-submit-alert").text(data.message);
				$("#session-login-submit-alert").removeClass("d-none");
				create_cookie("uniqueid", sanatize($("#login-session-id").val().trim()));
				create_cookie("uniquepin", sanatize($("#login-session-pin").val().trim().toString()));
				setTimeout(function() {
			        window.location.replace("/session/edit/");
			    }, 1200);
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
		erase_cookie("uniquepin");
		erase_cookie("degreeid");
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

			$.post("/session/getSessionData/",
	   		{
	   			sessionid: sanatize(getCookie("uniqueid")),
				pin: sanatize(getCookie("uniquepin")),
				   
			},   
	   		function(data,status) {
	   			$("#edit-session-id").val(sanatize(getCookie("uniqueid")));
				$("#edit-session-pin").val(sanatize(getCookie("uniquepin")));
				create_cookie("degreeid",data.degreeID);
	   			// grab degree specific data
	   			$.post("/administration/view-degree/js/",
		   		{
					degreeSearchText: sanatize(getCookie("degreeid"))
		   		},
		   		function(degreeData,degreeStatus) {
		   			$("#search-degree").val(degreeData.nDegreeName.trim()+" - "+degreeData.ncatalogYear.trim());
		   		});

	   			$("#search-degree").attr("degree-id", parseInt(sanatize(getCookie("degreeid"))));
				create_cookie("degreeid", $("#search-degree").attr("degree-id"));   
				if(data.semesterOption.toLowerCase().trim().indexOf("spring") != -1)
					$("#radio-spring").attr('checked', true);
				else if (data.semesterOption.toLowerCase().trim().indexOf("fall") != -1)
					$("#radio-fall").attr('checked', true);
				$("#edit-semester-hours").val(data.semesterHours);
				/*--check inputs--*/
				var myInput = document.getElementById("edit-session-pin");
				var mySearch = document.getElementById("search-degree");
				var myHours = document.getElementById("edit-semester-hours");
				var isSearchSatisfied = true;
				var isPinFilled = true;
				var isPinSatisfied = true;
				var isSemesterSatisfied = true;
				var isHoursSatisfied = true;
				//when the user clicks off the input for colleges, display field required if left empty AND disable the button
				//TODO: have backend check if the college the user enters actually exists
				mySearch.onkeyup = function() {
					$(mySearch).each(function() {  
						if($(this).val().trim().length == 0){
							$(this).attr("placeholder", "Field Required");
							isSearchSatisfied = false;
						}
						else{
							isSearchSatisfied= true;
						}
					})
					check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
				}
				// when the user clicks on the password field, show the message
				myInput.onfocus = function() {
				  document.getElementById("message").style.display = "block";
				}
				
				// when the user clicks outside of the password field, hide the message. if it is empty, display field requried AND disable the button
				myInput.onblur = function() {
					document.getElementById("message").style.display = "none";
					$(myInput).each(function() {  
						if($(this).val().trim().length == 0){
							$(this).attr("placeholder", "Field Required");
							isPinFilled = false;
						}
					})
					check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
				}
				myInput.onkeyup = function() {
					// validate length
					if(myInput.value.length == 4) {
						$("#length").removeClass("fa fa-times invalid");
						$("#length").addClass("fa fa-check valid");
						isPinFilled = true;
					} 
					else{
						$("#length").removeClass("fa fa-check valid");
						$("#length").addClass("fa fa-times invalid");
						isPinFilled = false;
					}   
					// validate numbers
					if(myInput.value.match(/^[0-9]+$/) != null) { //checks at all points if the entire string has no alphas, will fail if alphas are included
						$("#number").removeClass("fa fa-times invalid");
						$("#number").addClass("fa fa-check valid");
						isPinSatisfied = true;
					} 
					else {
						$("#number").removeClass("fa fa-check valid");
						$("#number").addClass("fa fa-times invalid");
						isPinSatisfied = false;
					}
					check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
				}
				$('#radio-spring, #radio-fall').click(function () { //if a user clicks a button, the restriction for the statment is lifted
					isSemesterSatisfied = true;
					check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
				})
				myHours.onkeyup = function() {
					$(myHours).each(function() {  
						if($(this).val().trim().length == 0){
							$(this).attr("placeholder", "Field Required");
							isHoursSatisfied = false;
						}
						else{
							isHoursSatisfied= true;
						}
					})
					check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied)
				}
				function check(isPinSatisfied,isPinFilled,isSearchSatisfied,isSemesterSatisfied,isHoursSatisfied) //a non-elegant way of checking the conditions every user action
				{
					if((isPinSatisfied && isPinFilled && isSearchSatisfied && isSemesterSatisfied && isHoursSatisfied) == true){
						$('#session-update-btn').prop('disabled', false);
					}
					else{
						$('#session-update-btn').prop('disabled', true);
					}
					//console.log("pinsat " + isPinSatisfied)
					//console.log("pinfilled " + isPinFilled)
					//onsole.log("search " + isSearchSatisfied)
					//console.log("radio " + isSemesterSatisfied)
				}

	   			for (var i = 0; i < data.Categories.courses.length; i++){
					var html = '<tr>'+
	    	           '<td>' +
	    			   '<div class="add-course input-group mt-2 mb-2 ml-5">' +
	    			   '<div class="input-group-prepend">' +
	    			   '<span class="input-group-text" style="padding-right: .5em;">' +
	    			   '<i class="fa fa-trash remove-course mr-1"></i>Course Name</span>' +
	    			   '</div>' +
	    			   '<input type="text" class="form-control add-course-input" course-id="'+data.Categories.courses[i].id+'" value="'+data.Categories.courses[i].courseDept+" "+data.Categories.courses[i].courseID+'" autocomplete="off">' +
	    			   '</div>' +
	    			   '</td>' +
	    	           '</tr>';
	    			$("#completed-courses").append(html);
				}
	   		});
		}
	}

	$(document).on("click", "#session-update-btn", function(e) {
		var jsonResponse = {};
		jsonResponse["sessionPIN"] = sanatize($("#edit-session-pin").val().trim().toString());
		jsonResponse["degreeID"] = sanatize($("#search-degree").attr("degree-id"));
		jsonResponse["completedCourses"] = {};
		jsonResponse["completedCourses"]["Categories"] = {};
		jsonResponse["completedCourses"]["Categories"]["courses"] = [];
		for(var i = 0; i < $("#completed-courses").children().length; i++){
			jsonResponse["completedCourses"]["Categories"]["courses"][i] = parseInt(sanatize($("#completed-courses").children().eq(i).children().children().children(".add-course-input").attr("course-id").trim()));
		}

		$.post("/session/updateSessionData/",
   		{
   			sessionid: sanatize(getCookie("uniqueid")),
   			pin: sanatize(getCookie("uniquepin")),
			sessionInfo: JSON.stringify(jsonResponse),
			semesterOption: sanatize($("input[name='inlineRadioOptions2']:checked").val().trim()),
			semesterHours: sanatize($("#edit-semester-hours").val().trim()),
		},   
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#edit-session-update-alert").removeClass("alert-danger");
				$("#edit-session-update-alert").addClass("alert-success");
				$("#edit-session-update-alert").text(data.message);
				$("#edit-session-update-alert").removeClass("d-none");
				// update cookies
				create_cookie("uniquepin", sanatize($("#edit-session-pin").val().trim().toString()));
				create_cookie("degreeid", $("#search-degree").attr("degree-id"));
				setTimeout(function() {
			        location.reload(true);
			    }, 1200);
   			} else {
   				$("#edit-session-update-alert").removeClass("alert-success");
				$("#edit-session-update-alert").addClass("alert-danger");
				$("#edit-session-update-alert").text(data.message);
				$("#edit-session-update-alert").removeClass("d-none");
   			}
   		});
	});


	/*-----------------------view degree plan js----------------------------------------- */
	if($("#view-degree-search-input").length){
		$(".input-group").eq(0).addClass("d-none");
		$("button").addClass("d-none");
    	// send request to the back-end...
		$.post("/administration/view-degree-detailed/js/",
   		{
			degreeSearchText: sanatize(getCookie("degreeid"))
   		},
   		function(data,status) {
			if(!$.isEmptyObject(data)) {
				// delete previous children if they exist
	    		$("#degree-categories").children().remove();
	    		
	    		// add data to fields below...
	    		$("#degreeaddinputGroupSelect-1").val(data.nCollegeName);
		    	$("#degreeaddinputGroupSelect-2").val(data.nDegreeName);
				$("#degreeaddinputGroupSelect-3").val(data.ncatalogYear);
				$("#degreeaddinputGroupSelect-4").val(data.nspecialty);
			
				// show form and scroll degree fields into view
				$("#view-degree-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#view-degree-search-btn").offset().top -20,
			    	scrollLeft: $("#view-degree-search-btn").offset().left -20
				});

				// grab info from back-end, start populating fields
				var jsonResponse = JSON.parse(data.ndegreeInfo);

				for(var i = 0; i < jsonResponse.Categories.length; i++){

					var html = '<div class="add-category input-group mb-3">' +
							   '<div class="input-group-prepend">' +
							   '<span class="input-group-text" style="padding-right: .5em;">' +
							   '<i class="mr-1"></i>category Name</span>' +
							   '</div>' +
							   '<input type="text" class="form-control" value="'+ jsonResponse.Categories[i].name +'" disabled>' +
							   '<div class="w-100">' +
							   '</div>' +
							   '<div class="input-group-prepend mt-2 mb-1 ml-3">' +
							   '<span class="input-group-text" style="padding-right: 1.0em;">' +
							   'Required # of Courses</span>' +
							   '</div>';

							   if(parseInt(jsonResponse.Categories[i].coursesRequired) == 0)
							   		html += '<input type="text" value="All" class="form-control mt-2" disabled>';
							   	else
							   		html += '<input type="text" value="'+ jsonResponse.Categories[i].coursesRequired +'" class="form-control mt-2" disabled>';

							   html += '<table class="category-courses w-100">';

							   for(var j = 0; j < jsonResponse.Categories[i].courses.length; j++){
							   		html += '<tr>'+
						    	           '<td>' +
						    			   '<div class="add-course input-group mt-2 mb-2 ml-5">' +
						    			   '<div class="input-group-prepend">' +
						    			   '<span class="input-group-text" style="padding-right: .5em;">' +
						    			   '<i class="mr-1"></i>Course Name</span>' +
						    			   '</div>' +
						    			   '<input type="text" course-id="' + jsonResponse.Categories[i].courses[j].id + '" value="'+ jsonResponse.Categories[i].courses[j].courseDept + " " + jsonResponse.Categories[i].courses[j].courseID +'" class="form-control add-course-input" autocomplete="off" disabled>' +
						    			   '</div>' +
						    			   '</td>' +
						    	           '</tr>';
							   }

						html += '</table>' +
							   '</div>';
					$("#degree-Categories").append(html);

				}

   			} else {
				$("#view-degree-alert").addClass("d-none");
   				$("#view-degree-alert").removeClass("alert-success");
				$("#view-degree-alert").addClass("alert-danger");
				$("#view-degree-alert").text("Cannot Find Degree Plan!");
				$("#view-degree-alert").removeClass("d-none");
   			}
   		});
	}


	/*-----------------------view transcript js----------------------------------------- */
	if($("#view-transcript-title").length){
		// call the back-end function which returns a json of the ordered set of classes to take
		$.post("/administration/scheduler/js/",
   		{
			sessionID: sanatize(getCookie("uniqueid"))
   		},
   		function(data,status) {
   			$("#timeline-loading-alert").remove(); // remove loading gif to display results to the user

   			for(var i = 1; i <= Math.ceil(data.numSemesters/2); i++){
   				var html = '<div class="row academic-year"></div>';
   				$("#transcript-results").append(html);
			}

			//if received a fail, output the message sent to us as to why it failed.   
			if(data.success.toLowerCase().indexOf("true") == -1) {
				$("#transcript-result-alert").removeClass("alert-success");
				$("#transcript-result-alert").addClass("alert-danger");
				$("#transcript-result-alert").text(data.message);
				$("#transcript-result-alert").removeClass("d-none");
				 // show form and scroll course fields into view
				 $('html, body').animate({
					 scrollTop: $("#transcript-result-alert").offset().top -20,
					 scrollLeft: $("#transcript-result-alert").offset().left -20
				 });
				 return;
			};

   			semesterIndex = 0;
   			numSemestersLeft = data.numSemesters;
   			$(".academic-year").each(function(acaIndex) {
   				var html = '<div class="col-md-6">'+
   							'<table class="table table-sm">'+
   							'<h5>Semester '+(++semesterIndex)+'</h5>'+
	   						'<thead>'+
	   						'<tr>'+
	   						'<th scope="col">Course</th>'+
	   						'<th scope="col">Name</th>'+
	   						'<th scope="col">Hours</th>'+
	   						'</tr>'+
	   						'</thead>'+
	   						'<tbody>';

	   				for(var i = 0; i < data[semesterIndex].length; i++){
	   					data[semesterIndex][i].Optional.toLowerCase().indexOf("true") != -1? html += '<tr style="background-color: #336699;">' : html += '<tr>';
						html += '<td>'+data[semesterIndex][i].CourseDept+' '+data[semesterIndex][i].CourseID+'</td>'+
								'<td>'+data[semesterIndex][i].Name+'</td>'+
								'<td>'+data[semesterIndex][i].Hours+'</td>'+
								'</tr>';
					}

					html += '</tbody>'+
							'</table>'+
							'</div>';

					$(this).append(html);
					numSemestersLeft--;
					if(numSemestersLeft > 0){
						var html = '<div class="col-md-6">'+
   							'<table class="table table-sm">'+
   							'<h5>Semester '+(++semesterIndex)+'</h5>'+
	   						'<thead>'+
	   						'<tr>'+
	   						'<th scope="col">Course</th>'+
	   						'<th scope="col">Name</th>'+
	   						'<th scope="col">Hours</th>'+
	   						'</tr>'+
	   						'</thead>'+
	   						'<tbody>';

		   				for(var i = 0; i < data[semesterIndex].length; i++){
		   					data[semesterIndex][i].Optional.toLowerCase().indexOf("true") != -1? html += '<tr style="background-color: #336699;">' : html += '<tr>';
							html += '<td>'+data[semesterIndex][i].CourseDept+' '+data[semesterIndex][i].CourseID+'</td>'+
									'<td>'+data[semesterIndex][i].Name+'</td>'+
									'<td>'+data[semesterIndex][i].Hours+'</td>'+
									'</tr>';
						}

						html += '</tbody>'+
								'</table>'+
								'</div>';

						$(this).append(html);
					}
   			});

   		});
	}

});