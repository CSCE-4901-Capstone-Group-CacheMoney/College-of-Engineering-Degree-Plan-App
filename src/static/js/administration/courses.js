$(document).ready(function(){

	/*-----------------------view course js----------------------------------------- */
	// function for capturing view text search info
	$(document).on("click", "#view-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course/js/",
	    {
	      courseSearchText: $("#view-course-search-input").val().trim()
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// add data to fields below...
		    	$("#view-course-deparment-id").val(data.CourseCode.split(" ")[0].trim());
				$("#view-course-number").val(data.CourseCode.split(" ")[1].trim());
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
				
			} else {
				// something went wrong, display error here
				$("#view-course-form").addClass("d-none");
				$("#view-course-alert").removeClass("alert-success");
				$("#view-course-alert").addClass("alert-danger");
				$("#view-course-alert").text(success+"<br>"+data);
				$("#view-course-alert").removeClass("d-none");
			}
	    });
	});

	// also capture enter key to trigger above function
	$("#view-course-search-input").keypress(function(e){
        if(e.which == 13) { $("#view-course-search-btn").click(); }
    });


    /*-----------------------edit course js----------------------------------------- */
	// function for capturing view text search info
	$(document).on("click", "#edit-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course/js/",
	    {
	      courseSearchText: $("#edit-course-search-input").val().trim()
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// add data to fields below...
		    	$("#edit-course-deparment-id").val(data.CourseCode.split(" ")[0].trim());
				$("#edit-course-number").val(data.CourseCode.split(" ")[1].trim());
				$("#edit-course-name").val(data.CourseName);

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
	$("#edit-course-search-input").keypress(function(e){
        if(e.which == 13) { $("#edit-course-search-btn").click(); }
    });

    $(document).on("click", "#edit-course-update-btn", function(e) {
    	// uncomment function below once we are ready to get 
		// data from the back-end

		// $.post("/js/administration/update-course/",
  //  		{
  //  			CourseID: $("#edit-course-deparment-id").val().trim(),
		// 	DepartmentID: $("#edit-course-deparment-id").val().trim(),
		// 	CourseNumber: $("#edit-course-number").val().trim()
  //  		},
  //  		function(data,status){
  //  			// grab data from back-end to use for conditional statement...
  //  		});

  		$("#edit-course-update-alert").removeClass("alert-danger");
		$("#edit-course-update-alert").addClass("alert-success");
		$("#edit-course-update-alert").text("Course Updated Successfully!");
		$("#edit-course-update-alert").removeClass("d-none");
		// show form and scroll course fields into view
		$('html, body').animate({
		    scrollTop: $("#edit-course-update-btn").offset().top -20,
		    scrollLeft: $("#edit-course-update-btn").offset().left -20
		});
    });


    /*-----------------------add course js----------------------------------------- */
	// also capture enter key to trigger above function
    $(document).on("click", "#add-course-submit-btn", function(e) {
    	// uncomment function below once we are ready to get 
		// data from the back-end

		// $.post("/js/administration/add-course/",
  //  		{
  //  			CourseID: $("#add-course-deparment-id").val().trim(),
		// 	DepartmentID: $("#add-course-deparment-id").val().trim(),
		// 	CourseNumber: $("#add-course-number").val().trim()
  //  		},
  //  		function(data,status){
  //  			// grab data from back-end to use for conditional statement...
  //  		});

  		$("#add-course-submit-alert").removeClass("alert-danger");
		$("#add-course-submit-alert").addClass("alert-success");
		$("#add-course-submit-alert").text("Course Created Successfully!");
		$("#add-course-submit-alert").removeClass("d-none");
		// show form and scroll course fields into view
		$('html, body').animate({
		    scrollTop: $("#add-course-submit-btn").offset().top -20,
		    scrollLeft: $("#add-course-submit-btn").offset().left -20
		});
    });

    // also capture enter key to trigger above function
    $("#add-course-submit-btn").keypress(function(e){
        if(e.which == 13) { $("#add-course-submit-btn").click(); }
    });


    /*-----------------------remove course js----------------------------------------- */
	// function for capturing view text search info
	$(document).on("click", "#remove-course-search-btn", function(e) {
		// send request to the back-end...
  		$.post("/administration/view-course/js/",
	    {
	      courseSearchText: $("#remove-course-search-input").val().trim()
	    },
	    function(data,status) {
	    	if(!$.isEmptyObject(data)) {
	    		// add data to fields below...
		    	$("#remove-course-deparment-id").val(data.CourseCode.split(" ")[0].trim());
				$("#remove-course-number").val(data.CourseCode.split(" ")[1].trim());
				$("#remove-course-name").val(data.CourseName);

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
	$("#remove-course-search-input").keypress(function(e){
        if(e.which == 13) { $("#remove-course-search-btn").click(); }
    });


    $(document).on("click", "#remove-course-submit-btn", function(e) {
    	// uncomment function below once we are ready to get 
		// data from the back-end

		// $.post("/js/administration/remove-course/",
  //  		{
  //  			course: $("#remove-course-search-input").val().trim()
  //  		},
  //  		function(data,status){
  //  			// grab data from back-end to use for conditional statement...
  //  		});

  		$("#remove-course-submit-alert").removeClass("alert-danger");
		$("#remove-course-submit-alert").addClass("alert-success");
		$("#remove-course-submit-alert").text("Course Removed Successfully!");
		$("#remove-course-submit-alert").removeClass("d-none");
		// show form and scroll course fields into view
		$('html, body').animate({
		    scrollTop: $("#remove-course-submit-btn").offset().top -20,
		    scrollLeft: $("#remove-course-submit-btn").offset().left -20
		});
    });

});