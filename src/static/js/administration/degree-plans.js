$(document).ready(function() {

	$('.select2').select2(); // used for search dropdown selection options

	// grab the csrf cookie token and setup ajax request header
	var csrftoken = getCookie('csrftoken');
	$.ajaxSetup({
	    beforeSend: function(xhr, settings) {
	        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
	            xhr.setRequestHeader("X-CSRFToken", csrftoken);
	        }
	    }
	});


	/*-----------------------add degree js----------------------------------------- */
	$("#degreeaddinputGroupSelect-3").on('keyup', function(){
		$(this).val(sanatize($(this).val().replace(/[a-z]/gi,'')));
	});	
	// auto complete for courses
    $('#degree-categories').on('keypress', '.add-course-input', function(e) {
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
	$('#degree-categories').on('focusout', '.add-course-input', function(e) {
		// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
     	var thisInputElement = $(this);

     	// temp turning this off as it is causing issues
	    // with adding course IDs to json
  //    	$.post("/administration/view-course/js/",
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
	
	$(document).on("click", "#add-degree-submit-btn", function(e) {

		var jsonResponse = {};
		jsonResponse["Categories"] = [];

		$('.add-category').each(function(catIndex) {

			var category = sanatize($(this).children("input").eq(0).val().trim());
			var requireNumCourses = parseInt(sanatize($(this).children("input").eq(1).val().trim()));

			jsonResponse["Categories"][catIndex] = {};
			jsonResponse["Categories"][catIndex]["name"] = category;
			jsonResponse["Categories"][catIndex]["courses"] = [];

			$(this).children(".category-courses").children("tr").each(function(couIndex) {
				var coursePKID = sanatize($(this).children().children().children("input").attr("course-id").trim());
				jsonResponse["Categories"][catIndex]["courses"][couIndex] = parseInt(coursePKID);
			});

			jsonResponse["Categories"][catIndex]["coursesRequired"] = parseInt(requireNumCourses);
		});

    	// send request to the back-end...
		$.post("/administration/add-degree/js/",
   		{
   			nCollegeName: sanatize($("#degreeaddinputGroupSelect-1").val().trim()),
   			nDegreeName: sanatize($("#degreeaddinputGroupSelect-2").val().trim()),
			ncatalogYear: sanatize($("#degreeaddinputGroupSelect-3").val().trim()),
			nspecialty: sanatize($("#degreeaddinputGroupSelect-4").val().trim()),
			ndegreeInfo: JSON.stringify(jsonResponse)
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#add-degree-submit-alert").removeClass("alert-danger");
				$("#add-degree-submit-alert").addClass("alert-success");
				$("#add-degree-submit-alert").text(data.message);
				$("#add-degree-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#add-degree-submit-btn").offset().top -20,
				    scrollLeft: $("#add-degree-submit-btn").offset().left -20
				});
				setTimeout(function() { 
			        location.reload(true);
			    }, 1200);
   			} else {
   				$("#add-degree-submit-alert").removeClass("alert-success");
				$("#add-degree-submit-alert").addClass("alert-danger");
				$("#add-degree-submit-alert").text(data.message);
				$("#add-degree-submit-alert").removeClass("d-none");
   			}
   		});
    });

    // also capture enter key to trigger above function
    $("#degreeaddinputGroupSelect-4").keypress(function(e) {
        if(e.which == 13) { $("#add-degree-submit-btn").click(); }
    });

    // for adding degree Categories
    $(document).on("click", "#add-degree-category-btn", function(e) {
    	var html = '<div class="add-category input-group mb-3">' +
    			   '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: .5em;">' +
    			   '<i class="fa fa-trash remove-category mr-1"></i>category Name</span>' +
    			   '</div>' +
    			   '<input type="text" class="form-control">' +
    			   '<div class="w-100">' +
    			   '</div>' +
    			   '<div class="input-group-prepend mt-2 mb-1 ml-3">' +
    			   '<span class="input-group-text" style="padding-right: 1.0em;">' +
    			   'Required # of Courses</span>' +
    			   '</div>' +
    			   '<input type="text" value="0" class="form-control mt-2">' +
    			   '<table class="category-courses w-100">' +
    			   '</table>' +
    			   '<button type="button" class="add-category-course btn btn-outline-success mb-1 mt-1 ml-5">Add Course</button>' +
    			   '</div>';
    	$("#degree-categories").append(html);
    });

    $(document).on("click", ".remove-category", function(e) {
    	$(this).parent().parent().parent().remove();
    });

    $(document).on("click", ".add-category-course", function(e) {
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
    	$(this).parent().children(".category-courses").append(html);
    });

    $(document).on("click", ".remove-course", function(e) {
    	$(this).parent().parent().parent().parent().parent().remove();
    });


	/*-----------------------remove degree js----------------------------------------- */
	
	$('#remove-degree-search-input').on('keypress' , function(e) {
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view degree
		$(this).autocomplete({
		    lookup: function (query, done) {
				var result;
				$.post("/administration/autoSearchDegree/js/",
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
				$("#remove-degree-search-input").val(suggestion["value"]);
				$("#remove-degree-search-input").attr("degree-id", parseInt(suggestion["degreeid"]));
				$("#remove-degree-search-btn").click();
		    }
		});
	});

	$(document).on("click", "#remove-degree-search-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/view-degree-detailed/js/",
   		{
			degreeSearchText: sanatize($("#remove-degree-search-input").attr("degree-id").trim())
   		},
   		function(data,status) {
			if(!$.isEmptyObject(data)) {
	    		// add data to fields below...
		    	$("#remove-degree-name").val(data.nDegreeName);
				$("#remove-college-name").val(data.nCollegeName);
				$("#remove-catalog-year").val(data.ncatalogYear);
				$("#remove-specialization").val(data.nspecialty);

				// now show the input fields to the user
				$("#remove-degree-alert").removeClass("alert-danger");
				$("#remove-degree-alert").addClass("alert-success");
				$("#remove-degree-alert").text("Degree Found!");
				$("#remove-degree-alert").removeClass("d-none");

				
				// show form and scroll degree fields into view
				$("#remove-degree-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#remove-degree-search-btn").offset().top -20,
			    	scrollLeft: $("#remove-degree-search-btn").offset().left -20
				});

   			} else {
				$("#remove-degree-alert").addClass("d-none");
   				$("#remove-degree-alert").removeClass("alert-success");
				$("#remove-degree-alert").addClass("alert-danger");
				$("#remove-degree-alert").text("Cannot Find Degree!");
				$("#remove-degree-alert").removeClass("d-none");
   			}
   		});
    });

    // also capture enter key to trigger above function
    $("#remove-degree-search-input").keypress(function(e) {
        if(e.which == 13) { $("#remove-degree-search-btn").click(); }
	});
	
	$(document).on("click", "#remove-degree-submit-btn", function(e) {
		// send request to the back-end...
		$.post("/administration/remove-degree/js/",
   		{
			   degreeSearchText: sanatize($("#remove-degree-name").val().trim()),
			   nDegreeName: sanatize($("#remove-degree-name").val().trim()),
			   ncatalogYear: sanatize($("#remove-catalog-year").val().trim()),
			   nCollegeName: sanatize($("#remove-college-name").val().trim()),
			   nspecialty: sanatize($("#remove-specialization").val().trim())
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("success") != -1) {
   				$("#remove-degeee-submit-alert").removeClass("alert-danger");
				$("#remove-degree-submit-alert").addClass("alert-success");
				$("#remove-degree-submit-alert").text(data.message);
				$("#remove-degree-submit-alert").removeClass("d-none");
				// show form and scroll degree fields into view
				$('html, body').animate({
				    scrollTop: $("#remove-degree-submit-btn").offset().top -20,
				    scrollLeft: $("#remove-degree-submit-btn").offset().left -20
				});
   			} else {
   				$("#remove-degree-submit-alert").removeClass("alert-success");
				$("#remove-degree-submit-alert").addClass("alert-danger");
				$("#remove-degree-submit-alert").text(data.message);
				$("#remove-degree-submit-alert").removeClass("d-none");
   			}
   		});
    });


    /*-----------------------edit degree js----------------------------------------- */
	
	$('#edit-degree-search-input').on('keypress' , function(e) {
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view degree
		$(this).autocomplete({
			lookup: function (query, done) {
				var result;
				$.post("/administration/autoSearchDegree/js/",
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
				$("#edit-degree-search-input").val(suggestion["value"]);
				$("#edit-degree-search-input").attr("degree-id", parseInt(suggestion["degreeid"]));
				$("#edit-degree-search-btn").click();
		    }
		});
	});

	$(document).on("click", "#edit-degree-search-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/view-degree-detailed/js/",
   		{
			degreeSearchText: sanatize($("#edit-degree-search-input").attr("degree-id").trim())
   		},
   		function(data,status) {
			if(!$.isEmptyObject(data)) {
				// delete previous children if they exist
	    		$("#degree-categories").children().remove();

	    		// add data to fields below...
		    	$("#degreeaddinputGroupSelect-1").val(data.nDegreeName);
				$("#degreeaddinputGroupSelect-2").val(data.nCollegeName);
				$("#degreeaddinputGroupSelect-3").val(data.ncatalogYear);
				$("#degreeaddinputGroupSelect-4").val(data.nspecialty);

				// now show the input fields to the user
				$("#edit-degree-alert").removeClass("alert-danger");
				$("#edit-degree-alert").addClass("alert-success");
				$("#edit-degree-alert").text("Degree Found!");
				$("#edit-degree-alert").removeClass("d-none");

				
				// show form and scroll degree fields into view
				$("#edit-degree-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#edit-degree-search-btn").offset().top -20,
			    	scrollLeft: $("#edit-degree-search-btn").offset().left -20
				});

				// grab info from back-end, start populating fields
				var jsonResponse = JSON.parse(data.ndegreeInfo);

				for(var i = 0; i < jsonResponse.Categories.length; i++){

					var html = '<div class="add-category input-group mb-3">' +
							   '<div class="input-group-prepend">' +
							   '<span class="input-group-text" style="padding-right: .5em;">' +
							   '<i class="fa fa-trash remove-category mr-1"></i>category Name</span>' +
							   '</div>' +
							   '<input type="text" class="form-control" value="'+ jsonResponse.Categories[i].name +'">' +
							   '<div class="w-100">' +
							   '</div>' +
							   '<div class="input-group-prepend mt-2 mb-1 ml-3">' +
							   '<span class="input-group-text" style="padding-right: 1.0em;">' +
							   'Required # of Courses</span>' +
							   '</div>' +
							   '<input type="text" value="'+ jsonResponse.Categories[i].coursesRequired +'" class="form-control mt-2">' +
							   '<table class="category-courses w-100">';

							   for(var j = 0; j < jsonResponse.Categories[i].courses.length; j++){
							   		html += '<tr>'+
						    	           '<td>' +
						    			   '<div class="add-course input-group mt-2 mb-2 ml-5">' +
						    			   '<div class="input-group-prepend">' +
						    			   '<span class="input-group-text" style="padding-right: .5em;">' +
						    			   '<i class="fa fa-trash remove-course mr-1"></i>Course Name</span>' +
						    			   '</div>' +
						    			   '<input type="text" course-id="' + jsonResponse.Categories[i].courses[j].id + '" value="'+ jsonResponse.Categories[i].courses[j].courseDept + " " + jsonResponse.Categories[i].courses[j].courseID +'" class="form-control add-course-input">' +
						    			   '</div>' +
						    			   '</td>' +
						    	           '</tr>';
							   }

						html += '</table>' +
							   '<button type="button" class="add-category-course btn btn-outline-success mb-1 mt-1 ml-5">Add Course</button>' +
							   '</div>';
					$("#degree-categories").append(html);

				}

				// grab info from back-end, start populating fields

   			} else {
				$("#edit-degree-alert").addClass("d-none");
   				$("#edit-degree-alert").removeClass("alert-success");
				$("#edit-degree-alert").addClass("alert-danger");
				$("#edit-degree-alert").text("Cannot Find Degree!");
				$("#edit-degree-alert").removeClass("d-none");
   			}
   		});
    });

    // also capture enter key to trigger above function
    $("#edit-degree-search-input").keypress(function(e) {
        if(e.which == 13) { $("#edit-degree-search-btn").click(); }
	});

    // funtion for update degree
	$(document).on("click", "#edit-degree-submit-btn", function(e) {

		var jsonResponse = {};
		jsonResponse["Categories"] = [];

		$('.add-category').each(function(catIndex) {

			var category = sanatize($(this).children("input").eq(0).val().trim());
			var requireNumCourses = parseInt(sanatize($(this).children("input").eq(1).val().trim()));

			jsonResponse["Categories"][catIndex] = {};
			jsonResponse["Categories"][catIndex]["name"] = category;
			jsonResponse["Categories"][catIndex]["courses"] = [];

			$(this).children(".category-courses").children().children("tr").each(function(couIndex) {
				var coursePKID = sanatize($(this).children().children().children("input").attr("course-id").trim());
				jsonResponse["Categories"][catIndex]["courses"][couIndex] = parseInt(coursePKID);
			});

			jsonResponse["Categories"][catIndex]["coursesRequired"] = parseInt(requireNumCourses);
		});

    	// send request to the back-end...
		$.post("/administration/edit-degree/js/",
   		{
   			nCollegeName: sanatize($("#degreeaddinputGroupSelect-1").val().trim()),
   			nDegreeName: sanatize($("#degreeaddinputGroupSelect-1").val().trim()),
			ncatalogYear: sanatize($("#degreeaddinputGroupSelect-3").val().trim()),
			nspecialty: sanatize($("#degreeaddinputGroupSelect-4").val().trim()),
			ndegreeInfo: JSON.stringify(jsonResponse)
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#edit-degree-submit-alert").removeClass("alert-danger");
				$("#edit-degree-submit-alert").addClass("alert-success");
				$("#edit-degree-submit-alert").text(data.message);
				$("#edit-degree-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
				$('html, body').animate({
				    scrollTop: $("#edit-degree-submit-btn").offset().top -20,
				    scrollLeft: $("#edit-degree-submit-btn").offset().left -20
				});
				setTimeout(function() {
			        location.reload(true);
			    }, 1200);
   			} else {
   				$("#edit-degree-submit-alert").removeClass("alert-success");
				$("#edit-degree-submit-alert").addClass("alert-danger");
				$("#edit-degree-submit-alert").text(data.message);
				$("#edit-degree-submit-alert").removeClass("d-none");
   			}
   		});
    });

	/*-----------------------view degree js----------------------------------------- */

	$('#view-degree-search-input').on('keypress' , function(e) {
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view degree
		$(this).autocomplete({
		    lookup: function (query, done) {
				var result;
				$.post("/administration/autoSearchDegree/js/",
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
				$("#view-degree-search-input").val(suggestion["value"]);
				$("#view-degree-search-input").attr("degree-id", parseInt(suggestion["degreeid"]));
				$("#view-degree-search-btn").click();
		    }
		});
	});

    $(document).on("click", "#view-degree-search-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/view-degree-detailed/js/",
   		{
			degreeSearchText: sanatize($("#view-degree-search-input").attr("degree-id").trim())
   		},
   		function(data,status) {
			if(!$.isEmptyObject(data)) {
				// delete previous children if they exist
	    		$("#degree-categories").children().remove();
	    		
	    		// add data to fields below...
		    	$("#degreeaddinputGroupSelect-1").val(data.nDegreeName);
				$("#degreeaddinputGroupSelect-2").val(data.nCollegeName);
				$("#degreeaddinputGroupSelect-3").val(data.ncatalogYear);
				$("#degreeaddinputGroupSelect-4").val(data.nspecialty);

				// now show the input fields to the user
				$("#view-degree-alert").removeClass("alert-danger");
				$("#view-degree-alert").addClass("alert-success");
				$("#view-degree-alert").text("Degree Found!");
				$("#view-degree-alert").removeClass("d-none");

				
				// show form and scroll degree fields into view
				$("#view-degree-form").removeClass("d-none");
				$('html, body').animate({
			    	scrollTop: $("#view-degree-search-btn").offset().top -20,
			    	scrollLeft: $("#view-degree-search-btn").offset().left -20
				});

				// grab info from back-end, start populating fields
				var jsonResponse =JSON.parse(data.ndegreeInfo);

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
						    			   '<input type="text" course-id="' + jsonResponse.Categories[i].courses[j].id + '" value="'+ jsonResponse.Categories[i].courses[j].courseDept + " " + jsonResponse.Categories[i].courses[j].courseID +'" class="form-control add-course-input" disabled>' +
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
				$("#view-degree-alert").text("Cannot Find Degree!");
				$("#view-degree-alert").removeClass("d-none");
   			}
   		});
    });

    // also capture enter key to trigger above function
    $("#view-degree-search-input").keypress(function(e) {
        if(e.which == 13) { $("#view-degree-search-btn").click(); }
	});

});