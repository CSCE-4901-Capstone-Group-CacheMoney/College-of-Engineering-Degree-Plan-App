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
	$(document).on("click", "#add-degree-submit-btn", function(e) {
    	// send request to the back-end...
		$.post("/administration/add-degree/js/",
   		{
   			// nDegreeCollegeName: $("#degreeaddinputGroupSelect-1").val().trim(),
   			nDegreeName: $("#degreeaddinputGroupSelect-2").val().trim(),
			ncatalogYear: $("#degreeaddinputGroupSelect-3").val().trim(),
			ndegreeInfo: $("#degreeaddinputGroupSelect-4").val().trim()
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