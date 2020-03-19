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
	// auto complete for courses
    $('#degree-catagories').on('keypress', '.add-course-input', function(e) {
    	// force uppercase
    	$(this).val(sanatize($(this).val().toUpperCase()));
     	var searchText = sanatize($(this).val().trim());
		// auto complete search for view course
		$(this).autocomplete({
		    lookup: function (query, done) {
				var result;
		        $.post("/administration/view-course/js/",
			    {
			      courseSearchText: sanatize(searchText)
				},
			    function(data,status) {
					if(!$.isEmptyObject(data)) {
						result = {
			            	suggestions: [
								{"value": data.CourseDept + " " +  data.CourseID + "-"+ data.CourseName}
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
		    }
		});
	});

	$(document).on("click", "#add-degree-submit-btn", function(e) {

		var jsonResponse = {};
		jsonResponse["Catagories"] = {};

		$('.add-catagory').each(function(index) {

			var catagory = sanatize($(this).children("input").eq(0).val().trim());
			var requireHours = parseInt(sanatize($(this).children("input").eq(1).val().trim()));

			jsonResponse["Catagories"][catagory] = {};
			jsonResponse["Catagories"][catagory]["Required Hours"] = requireHours;
			jsonResponse["Catagories"][catagory]["Courses"] = [];

			$(this).children(".catagory-courses").children("tr").each(function(index) {
				var course = sanatize($(this).children().children().children("input").val().trim());
				jsonResponse["Catagories"][catagory]["Courses"][index] = course;
			});

		});

    	// send request to the back-end...
		$.post("/administration/add-degree/js/",
   		{
   			nDegreeCollegeName: $("#degreeaddinputGroupSelect-4").val().trim(),
   			nDegreeName: $("#degreeaddinputGroupSelect-2").val().trim(),
			ncatalogYear: $("#degreeaddinputGroupSelect-3").val().trim(),
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

    // for adding degree catagories
    $(document).on("click", "#add-degree-catagory-btn", function(e) {
    	var html = '<div class="add-catagory input-group mb-3">' +
    			   '<div class="input-group-prepend">' +
    			   '<span class="input-group-text" style="padding-right: .5em;">' +
    			   '<i class="fa fa-trash remove-catagory mr-1"></i>Catagory Name</span>' +
    			   '</div>' +
    			   '<input type="text" class="form-control">' +
    			   '<div class="w-100">' +
    			   '</div>' +
    			   '<div class="input-group-prepend mt-2 mb-1 ml-3">' +
    			   '<span class="input-group-text" style="padding-right: 1.0em;">' +
    			   'Required Courses</span>' +
    			   '</div>' +
    			   '<input type="text" class="form-control mt-2">' +
    			   '<table class="catagory-courses w-100">' +
    			   '</table>' +
    			   '<button type="button" class="add-catagory-course btn btn-outline-success mb-1 mt-1 ml-5">Add Course</button>' +
    			   '</div>';
    	$("#degree-catagories").append(html);
    });

    $(document).on("click", ".remove-catagory", function(e) {
    	$(this).parent().parent().parent().remove();
    });

    $(document).on("click", ".add-catagory-course", function(e) {
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
    	$(this).parent().children(".catagory-courses").append(html);
    });

    $(document).on("click", ".remove-course", function(e) {
    	$(this).parent().parent().parent().remove();
    });


    /*-----------------------remove degree js----------------------------------------- */
	$(document).on("click", "#remove-degree-submit-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/remove-degree/js/",
   		{
   			// nDegreeCollegeName: $("#degreeremoveinputGroupSelect-1").val().trim(),
   			nDegreeName: $("#degreeremoveinputGroupSelect-2").val().trim(),
			ncatalogYear: $("#degreeremoveinputGroupSelect-3").val().trim()
			// ndegreeInfo: $("#degreeremoveinputGroupSelect-4").val().trim()
   		},
   		function(data,status) {
   			if(data.success.toLowerCase().indexOf("true") != -1) {
   				$("#remove-degree-submit-alert").removeClass("alert-danger");
				$("#remove-degree-submit-alert").addClass("alert-success");
				$("#remove-degree-submit-alert").text(data.message);
				$("#remove-degree-submit-alert").removeClass("d-none");
				// show form and scroll course fields into view
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

    // also capture enter key to trigger above function
    $("#degreeremoveinputGroupSelect-4").keypress(function(e) {
        if(e.which == 13) { $("#remove-degree-submit-btn").click(); }
    });


});