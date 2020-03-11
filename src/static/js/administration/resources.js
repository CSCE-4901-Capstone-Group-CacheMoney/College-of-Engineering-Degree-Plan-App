$(document).ready(function(){

	// code for changing field attributes
	$(document).on("change", "#selected-resource-type", function(e) {

		if($( "#selected-resource-type option:selected" ).text().toLowerCase() == 'person') {
			$("#inputGroup-sizing-default-5").text("Website");
		}
		else if($( "#selected-resource-type option:selected" ).text().toLowerCase() == 'department') {
			$("#inputGroup-sizing-default-5").text("Location");

		}
	});

});