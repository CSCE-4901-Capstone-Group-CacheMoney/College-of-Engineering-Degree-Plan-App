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

	/*-----------------------view course js----------------------------------------- */
    // force uppercase letters only
    $("#view-course-search-input").on('keyup', function(){
	    $(this).val(sanatize($(this).val().toUpperCase()));
	});

	// auto complete search for view course
	$('#view-course-search-input').autocomplete({
	    lookup: function (query, done) {
			var result;
	        $.post("/administration/autoSearchCourse/js/",
		    {
		      courseSearchText: sanatize($("#view-course-search-input").val().trim())
			},
		    function(data,status) {
				if(data.length > 1) {
					suggestions = [];
					var k = 0;
					for(var i = 1; i < data.length; i++){
						suggestions[k] = {};
						suggestions[k]["value"] = data[i].CourseDept + " " +  data[i].CourseID + "-"+ data[i].CourseName;
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
	        $("#view-course-search-input").val(suggestion["value"].split("-")[0].trim());
	        $("#view-course-search-btn").click();
	    }
	});

	// function for capturing view text search info
	$(document).on("click", "#view-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course-detailed/js/",
	    {
	      courseSearchText: sanatize($("#view-course-search-input").val().trim())
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// delete previous children if they exist
	    		$("#course-prerequisites").children().remove();
	    		$("#course-corequisites").children().remove();
	    		$("#add-course-degree-spec-reqs").children().remove();

	    		// add data to fields below...
		    	$("#view-course-deparment-id").val(data.CourseDept);
				$("#view-course-number").val(data.CourseID);
				$("#view-course-name").val(data.CourseName);

				if(data.CourseAvailability.toLowerCase().trim().indexOf("spring") != -1)
					$("#radio-spring").attr('checked', true);
				else if (data.CourseAvailability.toLowerCase().trim().indexOf("fall") != -1)
					$("#radio-fall").attr('checked', true);
				else
					$("#radio-both").attr('checked', true);

				$("#view-course-prerequisites").val(data.PrereqCount);
				$("#view-course-corequisites").val(data.CoreqCount);
				$("#view-course-hours").val(data.Hours);

				// now show the input fields to the user
				$("#view-course-alert").removeClass("alert-danger");
				$("#view-course-alert").addClass("alert-success");
				$("#view-course-alert").text("Course Found!");
				$("#view-course-alert").removeClass("d-none");

				// show form and scroll course fields into view
				$("#view-course-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#view-course-search-btn").offset().top -20,
			    	scrollLeft: $("#view-course-search-btn").offset().left -20
				});

				// parse out json for all generic and degree specific pre/co requisites
				var jsonResponse = JSON.parse(data.PreCoreq);
				// parse out json for all degree specific pre/co requisites
				for(var i = 0; i < jsonResponse.Categories.length; i++){
					if(jsonResponse.Categories[i].College.length != 0 && jsonResponse.Categories[i].DegreeYear.length != 0 && jsonResponse.Categories[i].Specialty.length != 0){
						var html = '<div class="input-group mb-3">' +
				    			   '<div class="input-group-prepend">' +
				    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Degree Name</span>' +
				    			   '</div>' + 
				    			   '<input type="text" class="course-degree-name-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" college="'+jsonResponse.Categories[i].College+'" catalog-year="'+jsonResponse.Categories[i].DegreeYear+'" specialty="'+jsonResponse.Categories[i].Specialty+'" value="'+jsonResponse.Categories[i].DegreeName+'" readonly>' + 
				    			   '<table class="degree-spec-course-reqs w-100 mt-3">';
				    			   for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Prerequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'" readonly>' + 
								    			'</div></tr></td>';
				    			   }
				    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Corequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'" readonly>' + 
								    			'</div></tr></td>';
				    			   }
				    		html +=	'</table>' +
				    			   '</div>';
						$("#add-course-degree-spec-reqs").append(html);
					} else {
							// parse out json for all generic pre/co requisites
							for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Prerequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'" readonly>' + 
							    			'</div>';
							    $("#course-prerequisites").append(html);
		    			   }
		    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Corequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'" readonly>' + 
							    			'</div>';
							    $("#course-corequisites").append(html);
		    			   }
					}
				}
				
			} else {
				// something went wrong, display error here
				$("#view-course-form").addClass("d-none");
				$("#view-course-alert").removeClass("alert-success");
				$("#view-course-alert").addClass("alert-danger");
				$("#view-course-alert").text("Unable to Find Course!");
				$("#view-course-alert").removeClass("d-none");
			}
	    });
	});

	// also capture enter key to trigger above function
	$("#view-course-search-input").keypress(function(e) {
        if(e.which == 13) { $("#view-course-search-btn").click(); }
    });


    /*-----------------------edit course js----------------------------------------- */
	// force uppercase letters only
    $("#edit-course-search-input").on('keyup', function(){
    	$(this).val(sanatize($(this).val().toUpperCase()));

	});
    // auto complete search for edit course
	$('#edit-course-search-input').autocomplete({
	    lookup: function (query, done) {
			var result;
	        $.post("/administration/autoSearchCourse/js/",
		    {
		      courseSearchText: sanatize($("#edit-course-search-input").val().trim())
			},
		    function(data,status) {
				if(data.length > 1) {
					suggestions = [];
					var k = 0;
					for(var i = 1; i < data.length; i++){
						suggestions[k] = {};
						suggestions[k]["value"] = data[i].CourseDept + " " +  data[i].CourseID + "-"+ data[i].CourseName;
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
	        $("#edit-course-search-input").val(suggestion["value"].split("-")[0].trim());
	        $("#edit-course-search-btn").click();
	    }
	});

	// function for capturing view text search info
	$(document).on("click", "#edit-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course-detailed/js/",
	    {
	      courseSearchText: sanatize($("#edit-course-search-input").val().trim())
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// delete previous children if they exist
	    		$("#course-prerequisites").children().remove();
	    		$("#course-corequisites").children().remove();
	    		$("#add-course-degree-spec-reqs").children().remove();

	    		// add data to fields below...
		    	$("#edit-course-deparment-id").val(data.CourseDept);
				$("#edit-course-number").val(data.CourseID);
				$("#edit-course-name").val(data.CourseName);
				$("#edit-course-id").val(data.ID);

				if(data.CourseAvailability.toLowerCase().trim().indexOf("spring") != -1)
					$("#radio-spring").attr('checked', true);
				else if (data.CourseAvailability.toLowerCase().trim().indexOf("fall") != -1)
					$("#radio-fall").attr('checked', true);
				else
					$("#radio-both").attr('checked', true);

				$("#edit-course-prerequisites").val(data.PrereqCount);
				$("#edit-course-corequisites").val(data.CoreqCount);
				$("#edit-course-hours").val(data.Hours);

				// now show the input fields to the user
				$("#edit-course-alert").removeClass("alert-danger");
				$("#edit-course-alert").addClass("alert-success");
				$("#edit-course-alert").text("Course Found!");
				$("#edit-course-alert").removeClass("d-none");

				// show form and scroll course fields into view
				$("#edit-course-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#edit-course-search-btn").offset().top -20,
			    	scrollLeft: $("#edit-course-search-btn").offset().left -20
				});

				// parse out json for all generic and degree specific pre/co requisites
				var jsonResponse = JSON.parse(data.PreCoreq);
				// parse out json for all degree specific pre/co requisites
				for(var i = 0; i < jsonResponse.Categories.length; i++){
					if(jsonResponse.Categories[i].College.length != 0 && jsonResponse.Categories[i].DegreeYear.length != 0 && jsonResponse.Categories[i].Specialty.length != 0){
						var html = '<div class="input-group mb-3">' +
				    			   '<div class="input-group-prepend">' +
				    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Degree Name</span>' +
				    			   '</div>' + 
				    			   '<input type="text" class="course-degree-name-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" college="'+jsonResponse.Categories[i].College+'" catalog-year="'+jsonResponse.Categories[i].DegreeYear+'" specialty="'+jsonResponse.Categories[i].Specialty+'" value="'+jsonResponse.Categories[i].DegreeName+'">' + 
				    			   '<table class="degree-spec-course-reqs w-100 mt-3">';
				    			   for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Prerequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'">' + 
								    			'</div></tr></td>';
				    			   }
				    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Corequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'">' + 
								    			'</div></tr></td>';
				    			   }
				    		html +=	'</table>' +
				    			   '<button type="button" class="add-degree-course-prerequisite btn btn-outline-success mb-1 mt-1 ml-5">Add Prerequisite</button>' +
				    			   '<button type="button" class="add-degree-course-corequisite btn btn-outline-success mb-1 mt-1 ml-5">Add Corequisites</button>' +
				    			   '</div>';
						$("#add-course-degree-spec-reqs").append(html);
					} else {
							// parse out json for all generic pre/co requisites
							for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Prerequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'">' + 
							    			'</div>';
							    $("#course-prerequisites").append(html);
		    			   }
		    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Corequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'">' + 
							    			'</div>';
							    $("#course-corequisites").append(html);
		    			   }
					}
				}
				
			} else {
				// something went wrong, display error here
				$("#edit-course-form").addClass("d-none");
				$("#edit-course-alert").removeClass("alert-success");
				$("#edit-course-alert").addClass("alert-danger");
				$("#edit-course-alert").text("Unable to find Course!");
				$("#edit-course-alert").removeClass("d-none");
			}
	    });
	});

	// also capture enter key to trigger above function
	$("#edit-course-search-input").keypress(function(e) {
        if(e.which == 13) { $("#edit-course-search-btn").click(); }
    });

    $(document).on("click", "#edit-course-update-btn", function(e) {
    	// build json entries for course general and degree specific pre and co req
    	var jsonResponse = {};
		jsonResponse["Categories"] = [];

    	if($("#add-course-degree-spec-reqs").children().length > 0){
    		for(var i = 0; i < $("#add-course-degree-spec-reqs").children().length; i++){
    			jsonResponse["Categories"][i] = {};
    			var degreeName = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").val().trim());
    			var catalogYear = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("catalog-year").trim());
    			var college = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("college").trim());
    			var specialty = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("specialty").trim());
    			jsonResponse["Categories"][i]["College"] = college;
    			jsonResponse["Categories"][i]["DegreeName"] = degreeName;
    			jsonResponse["Categories"][i]["DegreeYear"] = parseInt(catalogYear);
    			jsonResponse["Categories"][i]["Specialty"] = specialty;
    			jsonResponse["Categories"][i]["PreReqs"] = [];
    			jsonResponse["Categories"][i]["CoReqs"] = [];
    			if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().length > 0){
    				var k = 0;
    				var l = 0;
    				var iterator;
    				if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(0).is("tbody"))
    					iterator = $("#add-course-degree-spec-reqs").children().eq(i).children("table").children().children().length;
    				else
    					iterator = $("#add-course-degree-spec-reqs").children().eq(i).children("table").children().length;

    				for(var j = 0; j < iterator; j++){
    					if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(0).is("tbody")){
    						if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().children().eq(j).children().children().children("input").hasClass("course-prerequisite-input")){
	    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().children().eq(j).children().children().children("input").attr("course-id"));
	    						jsonResponse["Categories"][i]["PreReqs"][k] = parseInt(courseID);
	    						k++
	    					}
	    					else if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().children().eq(j).children().children().children("input").hasClass("course-corequisite-input")){
	    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().children().eq(j).children().children().children("input").attr("course-id"));
	    						jsonResponse["Categories"][i]["CoReqs"][l] = parseInt(courseID);
	    						l++;
	    					}
    					}
    					else {
	    					if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").hasClass("course-prerequisite-input")){
	    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").attr("course-id"));
	    						jsonResponse["Categories"][i]["PreReqs"][k] = parseInt(courseID);
	    						k++
	    					}
	    					else if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").hasClass("course-corequisite-input")){
	    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").attr("course-id"));
	    						jsonResponse["Categories"][i]["CoReqs"][l] = parseInt(courseID);
	    						l++;
	    					}
	    				}
    				}
    			}
    		}
    	}
		// build generic pre co req json entry
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length] = {};
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["College"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["DegreeName"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["DegreeYear"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["Specialty"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["PreReqs"] = [];
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["CoReqs"] = [];
		for(var i = 0; i < $("#course-prerequisites").children().length; i++){
			var courseID = sanatize($("#course-prerequisites").children().eq(i).children("input").attr("course-id"));
			jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["PreReqs"][i] = parseInt(courseID);
		}
		for(var i = 0; i < $("#course-corequisites").children().length; i++){
			var courseID = sanatize($("#course-corequisites").children().eq(i).children("input").attr("course-id"));
			jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["CoReqs"][i] = parseInt(courseID);
		}
    	// send request to the back-end...
		$.post("/administration/edit-course/js/",
   		{
   			DepartmentID: sanatize($("#edit-course-deparment-id").val().trim()),
			CourseNumber: sanatize($("#edit-course-number").val().trim()),
			CourseName: sanatize($("#edit-course-name").val().trim()),
			CourseAvailability: sanatize($("input[name='inlineRadioOptions']:checked").val()),
			nCoursePreCoreqInfo: JSON.stringify(jsonResponse),
			CourseHours: sanatize($("#edit-course-hours").val().trim()),
			CourseID: sanatize($("#edit-course-id").val().trim())
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#edit-course-update-alert").removeClass("alert-danger");
				$("#edit-course-update-alert").addClass("alert-success");
				$("#edit-course-update-alert").text("Course Updated Successfully!");
				$("#edit-course-update-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#edit-course-update-btn").offset().top -20,
				    scrollLeft: $("#edit-course-update-btn").offset().left -20
				});
   			} else {
   				$("#edit-course-update-alert").removeClass("alert-success");
				$("#edit-course-update-alert").addClass("alert-danger");
				$("#edit-course-update-alert").text(data.message);
				$("#edit-course-update-alert").removeClass("d-none");
   			}
   		});
    });

    /*-----------------------add course js----------------------------------------- */
    // force letters in dept only
    // force uppercase letters only
    $("#add-course-deparment-id").on('keyup', function(){
    	$(this).val(sanatize($(this).val().replace(/[0-9]/gi,'')));
	    $(this).val(sanatize($(this).val().toUpperCase()));
	});
	
    // force numbers in dept only
	$("#add-course-number").on('keyup', function(){
    	$(this).val(sanatize($(this).val().replace(/[a-z]/gi,'')));
	});

	// also capture enter key to trigger above function
    $(document).on("click", "#add-course-submit-btn", function(e) {
    	// build json entries for course general and degree specific pre and co req
    	var jsonResponse = {};
		jsonResponse["Categories"] = [];

    	if($("#add-course-degree-spec-reqs").children().length > 0){
    		for(var i = 0; i < $("#add-course-degree-spec-reqs").children().length; i++){
    			jsonResponse["Categories"][i] = {};
    			var degreeName = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").val().trim());
    			var catalogYear = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("catalog-year").trim());
    			var college = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("college").trim());
    			var specialty = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("input").attr("specialty").trim());
    			jsonResponse["Categories"][i]["College"] = college;
    			jsonResponse["Categories"][i]["DegreeName"] = degreeName;
    			jsonResponse["Categories"][i]["DegreeYear"] = parseInt(catalogYear);
    			jsonResponse["Categories"][i]["Specialty"] = specialty;
    			jsonResponse["Categories"][i]["PreReqs"] = [];
    			jsonResponse["Categories"][i]["CoReqs"] = [];
    			if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().length > 0){
    				var k = 0;
    				var l = 0;
    				for(var j = 0; j < $("#add-course-degree-spec-reqs").children().eq(i).children("table").children().length; j++){
    					if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").hasClass("course-prerequisite-input")){
    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").attr("course-id"));
    						jsonResponse["Categories"][i]["PreReqs"][k] = parseInt(courseID);
    						k++
    					}
    					else if($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").hasClass("course-corequisite-input")){
    						var courseID = sanatize($("#add-course-degree-spec-reqs").children().eq(i).children("table").children().eq(j).children().children().children("input").attr("course-id"));
    						jsonResponse["Categories"][i]["CoReqs"][l] = parseInt(courseID);
    						l++;
    					}
    				}
    			}
    		}
    	}
		// build generic pre co req json entry
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length] = {};
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["College"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["DegreeName"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["DegreeYear"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["Specialty"] = "";
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["PreReqs"] = [];
		jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["CoReqs"] = [];
		for(var i = 0; i < $("#course-prerequisites").children().length; i++){
			var courseID = sanatize($("#course-prerequisites").children().eq(i).children("input").attr("course-id"));
			jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["PreReqs"][i] = parseInt(courseID);
		}
		for(var i = 0; i < $("#course-corequisites").children().length; i++){
			var courseID = sanatize($("#course-corequisites").children().eq(i).children("input").attr("course-id"));
			jsonResponse["Categories"][$("#add-course-degree-spec-reqs").children().length]["CoReqs"][i] = parseInt(courseID);
		}
    	// send request to the back-end...
		$.post("/administration/add-course/js/",
   		{
   			nCourseDept: sanatize($("#add-course-deparment-id").val().trim()),
			nCourseID: sanatize($("#add-course-number").val().trim()),
			nCourseName: sanatize($("#add-course-name").val().trim()),
			nCourseAvail: sanatize($("input[name='inlineRadioOptions']:checked").val()),
			nCoursePreCoreqInfo: JSON.stringify(jsonResponse),
			nCourseHours: sanatize($("#add-course-hours").val().trim()),
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#add-course-submit-alert").removeClass("alert-danger");
				$("#add-course-submit-alert").addClass("alert-success");
				$("#add-course-submit-alert").text(data.message);
				$("#add-course-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#add-course-submit-btn").offset().top -20,
				    scrollLeft: $("#add-course-submit-btn").offset().left -20
				});
   			} else {
   				$("#add-course-submit-alert").removeClass("alert-success");
				$("#add-course-submit-alert").addClass("alert-danger");
				$("#add-course-submit-alert").text(data.message);
				$("#add-course-submit-alert").removeClass("d-none");
   			}
   		});
    });

    // also capture enter key to trigger above function
    $("#add-course-hours").keypress(function(e) {
        if(e.which == 13) { $("#add-course-submit-btn").click(); }
    });


    // for adding course prerequisites
    $(document).on("click", "#add-course-prerequisite, .add-degree-course-prerequisite", function(e) {
    	var html = "";
    	if($(this).hasClass("add-degree-course-prerequisite"))
    		html += '<div class="input-group mb-3 ml-5">';
    	else
    		html += '<div class="input-group mb-3">';

    		html += '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Prerequisite</span>' +
    			   '</div>' + 
    			   '<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4">' + 
    			   '</div>';
    	
    	if($(this).hasClass("add-degree-course-prerequisite"))
    		$(this).parent().children("table").append('<tr><td>'+ html +'</tr></td>');
    	else
    		$("#course-prerequisites").append(html);
    });

    // for adding course corequisites
    $(document).on("click", "#add-course-corequisites, .add-degree-course-corequisite", function(e) {
    	var html = "";
    	if($(this).hasClass("add-degree-course-corequisite"))
    		html += '<div class="input-group mb-3 ml-5">';
    	else
    		html += '<div class="input-group mb-3">';

    		html += '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Corequisite</span>' +
    			   '</div>' + 
    			   '<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4">' + 
    			   '</div>';

    	if($(this).hasClass("add-degree-course-corequisite"))
    		$(this).parent().children("table").append('<tr><td>'+ html +'</tr></td>');
    	else
    		$("#course-corequisites").append(html);
    });


    // for adding course prerequisites DEGREE SPECIFIC
    $(document).on("click", "#add-course-degree-spec-req", function(e) {
    	var html = '<div class="input-group mb-3">' +
    			   '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4"><i class="fa fa-trash remove-category mr-1"></i>Degree Name</span>' +
    			   '</div>' + 
    			   '<input type="text" class="course-degree-name-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4">' + 
    			   '<table class="degree-spec-course-reqs w-100 mt-3">' + 
    			   '</table>' +
    			   '<button type="button" class="add-degree-course-prerequisite btn btn-outline-success mb-1 mt-1 ml-5">Add Prerequisite</button>' +
    			   '<button type="button" class="add-degree-course-corequisite btn btn-outline-success mb-1 mt-1 ml-5">Add Corequisites</button>' +
    			   '</div>';
    	$("#add-course-degree-spec-reqs").append(html);
    });


    // auto complete for courses in pre and co req
    $('#course-requirements, #add-course-degree-spec-reqs').on('keypress', '.course-prerequisite-input, .course-corequisite-input', function(e) {
    	// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view course
		$(this).autocomplete({
			lookup: function (query, done) {
				var result;
		        $.post("/administration/autoSearchCourse/js/",
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

    // add course iD if user manually enters course in pre and co req
	$('#course-requirements, #add-course-degree-spec-reqs').on('focusout', '.course-prerequisite-input, .course-corequisite-input', function(e) {
		// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
     	var thisInputElement = $(this);
     	$.post("/administration/view-course/js/",
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


	// auto complete for degree specific pre and co req reqs (DEGREE SPECIFIC)
    $('#add-course-degree-spec-reqs').on('keypress', '.course-degree-name-input', function(e) {
    	// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view course
		$(this).autocomplete({
		    lookup: function (query, done) {
				var result;
		        $.post("/administration/view-degree/js/",
			    {
			      degreeSearchText: sanatize(searchText)
				},
			    function(data,status) {
					if(!$.isEmptyObject(data)) {
						result = {
			            	suggestions: [
								{"value": data.nDegreeName + " - " + data.ncatalogYear + " - " + data.nCollegeName + " - " + data.nspecialty}
			            	]
						};
						done(result);
					} else {
						result = { suggestions: [] };
						done(result);
					}
				});
		    },
		    onSelect: function (suggestion) {
		        $(this).val(suggestion.value.split("-")[0].trim());
		        $(this).attr("catalog-year", suggestion.value.split("-")[1].trim());
		        $(this).attr("college", suggestion.value.split("-")[2].trim());
		        $(this).attr("specialty", suggestion.value.split("-")[3].trim());
		    }
		});
	});

    // add degree info if user manually enters degree (DEGREE SPECIFIC)
	$('#add-course-degree-spec-reqs').on('focusout', '.course-degree-name-input', function(e) {
		// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
     	var thisInputElement = $(this);
     	$.post("/administration/view-degree/js/",
	    {
	      degreeSearchText: sanatize(searchText)
		},
	    function(data,status) {
			if(!$.isEmptyObject(data) && !data.nDegreeName.toLowerCase().indexOf("none")) {
				$(thisInputElement).attr("catalog-year", data.ncatalogYear);
				$(thisInputElement).attr("college", data.nCollegeName);
				$(thisInputElement).attr("specialty", data.nspecialty);
			}
		});
	});

    /*-----------------------remove course js----------------------------------------- */
    // force uppercase letters only
    $("#remove-course-search-input").on('keyup', function(){
    	$(this).val(sanatize($(this).val().toUpperCase()));

	});

    // auto complete search for remove course
	$('#remove-course-search-input').autocomplete({
	    lookup: function (query, done) {
			var result;
	        $.post("/administration/autoSearchCourse/js/",
		    {
		      courseSearchText: sanatize($("#remove-course-search-input").val().trim())
			},
		    function(data,status) {
				if(data.length > 1) {
					suggestions = [];
					var k = 0;
					for(var i = 1; i < data.length; i++){
						suggestions[k] = {};
						suggestions[k]["value"] = data[i].CourseDept + " " +  data[i].CourseID + "-"+ data[i].CourseName;
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
	        $("#remove-course-search-input").val(suggestion["value"].split("-")[0].trim());
	        $("#remove-course-search-btn").click();
	    }
	});

	// function for capturing view text search info
	$(document).on("click", "#remove-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course-detailed/js/",
	    {
	      courseSearchText: sanatize($("#remove-course-search-input").val().trim())
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// delete previous children if they exist
	    		$("#course-prerequisites").children().remove();
	    		$("#course-corequisites").children().remove();
	    		$("#add-course-degree-spec-reqs").children().remove();

	    		// add data to fields below...
		    	$("#remove-course-deparment-id").val(data.CourseDept);
				$("#remove-course-number").val(data.CourseID);
				$("#remove-course-name").val(data.CourseName);
				$("#remove-course-id").val(data.ID);

				if(data.CourseAvailability.toLowerCase().trim().indexOf("spring") != -1)
					$("#radio-spring").attr('checked', true);
				else if (data.CourseAvailability.toLowerCase().trim().indexOf("fall") != -1)
					$("#radio-fall").attr('checked', true);
				else
					$("#radio-both").attr('checked', true);

				$("#remove-course-prerequisites").val(data.PrereqCount);
				$("#remove-course-corequisites").val(data.CoreqCount);
				$("#remove-course-hours").val(data.Hours);

				// now show the input fields to the user
				$("#remove-course-alert").removeClass("alert-danger");
				$("#remove-course-alert").addClass("alert-success");
				$("#remove-course-alert").text("Course Found!");
				$("#remove-course-alert").removeClass("d-none");

				// show form and scroll course fields into view
				$("#remove-course-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#remove-course-search-btn").offset().top -20,
			    	scrollLeft: $("#remove-course-search-btn").offset().left -20
				});

				// parse out json for all generic and degree specific pre/co requisites
				var jsonResponse = JSON.parse(data.PreCoreq);
				// parse out json for all degree specific pre/co requisites
				for(var i = 0; i < jsonResponse.Categories.length; i++){
					if(jsonResponse.Categories[i].College.length != 0 && jsonResponse.Categories[i].DegreeYear.length != 0 && jsonResponse.Categories[i].Specialty.length != 0){
						var html = '<div class="input-group mb-3">' +
				    			   '<div class="input-group-prepend">' +
				    			   '<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Degree Name</span>' +
				    			   '</div>' + 
				    			   '<input type="text" class="course-degree-name-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" college="'+jsonResponse.Categories[i].College+'" catalog-year="'+jsonResponse.Categories[i].DegreeYear+'" specialty="'+jsonResponse.Categories[i].Specialty+'" value="'+jsonResponse.Categories[i].DegreeName+'" readonly>' + 
				    			   '<table class="degree-spec-course-reqs w-100 mt-3">';
				    			   for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Prerequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'" readonly>' + 
								    			'</div></tr></td>';
				    			   }
				    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
				    			   		html += '<tr><td><div class="input-group mb-3 ml-5">';
				    			   		html += '<div class="input-group-prepend">' +
								    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Corequisite</span>' +
								    			'</div>' + 
								    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'" readonly>' + 
								    			'</div></tr></td>';
				    			   }
				    		html +=	'</table>' +
				    			   '</div>';
						$("#add-course-degree-spec-reqs").append(html);
					} else {
							// parse out json for all generic pre/co requisites
							for(var j = 0; j < jsonResponse.Categories[i].PreReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Prerequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-prerequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].PreReqs[j].id+'" value="'+jsonResponse.Categories[i].PreReqs[j].courseDept+ ' '+jsonResponse.Categories[i].PreReqs[j].courseID+'" readonly>' + 
							    			'</div>';
							    $("#course-prerequisites").append(html);
		    			   }
		    			   for(var j = 0; j < jsonResponse.Categories[i].CoReqs.length; j++){
		    			   		var html = '<div class="input-group mb-3">';
		    			   			html += '<div class="input-group-prepend">' +
							    			'<span class="input-group-text" style="padding-right: 3.3em;" id="inputGroup-sizing-default-4">Corequisite</span>' +
							    			'</div>' + 
							    			'<input type="text" class="course-corequisite-input form-control" aria-label="Default" aria-describedby="inputGroup-sizing-default-4" course-id="'+jsonResponse.Categories[i].CoReqs[j].id+'" value="'+jsonResponse.Categories[i].CoReqs[j].courseDept+ ' '+jsonResponse.Categories[i].CoReqs[j].courseID+'" readonly>' + 
							    			'</div>';
							    $("#course-corequisites").append(html);
		    			   }
					}
				}
				
			} else {
				// something went wrong, display error here
				$("#remove-course-form").addClass("d-none");
				$("#remove-course-alert").removeClass("alert-success");
				$("#remove-course-alert").addClass("alert-danger");
				$("#remove-course-alert").text("Unable to find Course!");
				$("#remove-course-alert").removeClass("d-none");
			}
	    });
	});

	// also capture enter key to trigger above function
	$("#remove-course-search-input").keypress(function(e) {
        if(e.which == 13) { $("#remove-course-search-btn").click(); }
    });


    $(document).on("click", "#remove-course-submit-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/remove-course/js/",
   		{
   			courseSearchText: sanatize($("#remove-course-deparment-id").val().trim() + 
   			" " + $("#remove-course-number").val().trim())
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("success") != -1) {
   				$("#remove-course-submit-alert").removeClass("alert-danger");
				$("#remove-course-submit-alert").addClass("alert-success");
				$("#remove-course-submit-alert").text(data.message);
				$("#remove-course-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#remove-course-submit-btn").offset().top -20,
				    scrollLeft: $("#remove-course-submit-btn").offset().left -20
				});
   			} else {
   				$("#remove-course-submit-alert").removeClass("alert-success");
				$("#remove-course-submit-alert").addClass("alert-danger");
				$("#remove-course-submit-alert").text(data.message);
				$("#remove-course-submit-alert").removeClass("d-none");
   			}
   		});
    });

});