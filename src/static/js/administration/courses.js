$(document).ready(function(){

	// function for capturing view text search info
	$(document).on("click", "#view-course-search-btn", function(e) {

		// uncomment function below once we are ready to get 
		// data from the back-end

  		// $.post("/js/administration/view-course",
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
			$("#view-course-alert").removeClass("alert-success");
			$("#view-course-alert").addClass("alert-danger");
			$("#view-course-alert").text("Unable to Find Course");
			$("#view-course-alert").removeClass("d-none");
		}
	});


});