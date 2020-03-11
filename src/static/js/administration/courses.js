$(document).ready(function(){

	/*-----------------------view course js----------------------------------------- */
	// function for capturing view text search info
	$(document).on("click", "#view-course-search-btn", function(e) {
		// uncomment function below once we are ready to get 
		// data from the back-end

  		// $.post("/js/administration/search-course/",
	   //  {
	   //    course: $("#view-course-search-input").val().trim()
	   //  },
	   //  function(data,status){
	   //    // grab data from back-end to use for conditional statement...
	   //  });

		var srch_ext = $("#view-course-search-input").val().trim();
		if(srch_ext.toLowerCase().indexOf("capstone") != -1) {
			$("#view-course-alert").removeClass("alert-danger");
			$("#view-course-alert").addClass("alert-success");
			$("#view-course-alert").text("Course Found!");
			$("#view-course-alert").removeClass("d-none");
			// add data to fields below...
			$("#view-course-deparment-id").val("0785");
			$("#view-course-deparment-id").val("0781");
			$("#view-course-number").val("CSCE 4901");
			$("#view-course-name").val("Computer Science Capstone");
			$("#radio-spring").attr('checked', true);
			$("#view-course-prerequisites").val("CSCE 3110, CSCE 4444");
			$("#view-course-corequisites").val("CSCE 4110");
			$("#view-course-hours").val("3");


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
			$("#view-course-alert").text("Unable to Find Course");
			$("#view-course-alert").removeClass("d-none");
		}
	});

	// also capture enter key to trigger above function
	$("#view-course-search-input").keypress(function(e){
        if(e.which == 13) { $("#view-course-search-btn").click(); }
    });


    /*-----------------------edit course js----------------------------------------- */
	// function for capturing view text search info
	$(document).on("click", "#edit-course-search-btn", function(e) {
		// uncomment function below once we are ready to get 
		// data from the back-end

  		// $.post("/js/administration/search-course/",
	   //  {
	   //    course: $("#edit-course-search-input").val().trim()
	   //  },
	   //  function(data,status){
	   //    // grab data from back-end to use for conditional statement...
	   //  });

		var srch_ext = $("#edit-course-search-input").val().trim();
		if(srch_ext.toLowerCase().indexOf("capstone") != -1) {
			$("#edit-course-alert").removeClass("alert-danger");
			$("#edit-course-alert").addClass("alert-success");
			$("#edit-course-alert").text("Course Found!");
			$("#edit-course-alert").removeClass("d-none");
			// add data to fields below...
			$("#edit-course-deparment-id").val("0785");
			$("#edit-course-deparment-id").val("0781");
			$("#edit-course-number").val("CSCE 4901");
			$("#edit-course-name").val("Computer Science Capstone");
			$("#radio-spring").attr('checked', true);
			$("#edit-course-prerequisites").val("CSCE 3110, CSCE 4444");
			$("#edit-course-corequisites").val("CSCE 4110");
			$("#edit-course-hours").val("3");


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
			$("#edit-course-alert").text("Unable to Find Course");
			$("#edit-course-alert").removeClass("d-none");
		}
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
		// uncomment function below once we are ready to get 
		// data from the back-end

  		// $.post("/js/administration/search-course/",
	   //  {
	   //    course: $("#remove-course-search-input").val().trim()
	   //  },
	   //  function(data,status){
	   //    // grab data from back-end to use for conditional statement...
	   //  });

		var srch_ext = $("#remove-course-search-input").val().trim();
		if(srch_ext.toLowerCase().indexOf("capstone") != -1) {
			$("#remove-course-alert").removeClass("alert-danger");
			$("#remove-course-alert").addClass("alert-success");
			$("#remove-course-alert").text("Course Found!");
			$("#remove-course-alert").removeClass("d-none");
			// add data to fields below...
			$("#remove-course-deparment-id").val("0785");
			$("#remove-course-deparment-id").val("0781");
			$("#remove-course-number").val("CSCE 4901");
			$("#remove-course-name").val("Computer Science Capstone");
			$("#radio-spring").attr('checked', true);
			$("#remove-course-prerequisites").val("CSCE 3110, CSCE 4444");
			$("#remove-course-corequisites").val("CSCE 4110");
			$("#remove-course-hours").val("3");


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
			$("#remove-course-alert").text("Unable to Find Course");
			$("#remove-course-alert").removeClass("d-none");
		}
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