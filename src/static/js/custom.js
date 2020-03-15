$(document).ready(function(){

	//TODO other elements functionality...


	// TODO Ajax connection to prevent refreshing...
	$("button").click(function(){
  		$.post("demo_test_post.asp",
  		{
    		degreeSelection: $("#id_degreeChoices").text()
  		},
  		function(data, status){
    		console.log("Data: " + data + "\nStatus: " + status);
  		});
	});

});