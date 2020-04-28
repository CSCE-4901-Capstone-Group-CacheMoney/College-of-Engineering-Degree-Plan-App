var coreCount = 1;
var courseCount = 1;
var sectionCount =1;
function toggleCourseInfo(event, el) {

    console.log(el);

    $(el).toggleClass("courseNameHighlight");
    $("[id='"+event+"']").toggle();
    $("[id='"+event+"']").css("padding-left","2em");
}


$(document).ready(function(){
    $("#coreButton").bind("click", function(e){
        coreCount += 1;
        console.log(coreCount);
        e.preventDefault();

        var $newDiv = $("<div>", {id:coreCount});
        $("#uniCore").append($newDiv);

        var newBreak = "<br>";
        var newPrompt = "<b>Enter the name of the University Core section: </b>";
        var newInput = "<input type='text' name='sectionName' placeholder='Ex. Communications'>";
        var newHourPrompt = "<b>Enter the number of credits for the section: </b>";
        var newHourInput = "<input type='text' name='sectionHours' placeholder='Ex. 5'>";
        var $newRemoveButton = $("<button>", {
            class: "remover",
            text: "Remove Section"
        });

        $("#"+coreCount).append(newBreak, newPrompt, newInput, newBreak, newBreak, newHourPrompt, newHourInput, $newRemoveButton);
    });

});
$(document).ready(function(){
    $("#courseButton").bind("click", function(e){
        courseCount += 1;
        console.log(courseCount);
        e.preventDefault();

        var $newDiv = $("<div>", {id:courseCount});
        $("#degreeRequirement").append($newDiv);

        var newBreak = "<br>";
        var newPrompt = "<b>Enter the name of the course: </b>";
        var newInput = "<input type='text' name='courseName' placeholder='Ex. CSCE 1030'>";
        var $newRemoveButton = $("<button>", {
            class: "remover",
            text: "Remove Section"
        });

        $("#"+courseCount).append(newBreak, newPrompt, newInput, newBreak, newBreak);
    });

});
$(document).ready(function(){
    $("#newSectionButton").bind("click", function(e){
        sectionCount += 1;
        console.log(sectionCount);
        e.preventDefault();

        var secID = "dR" + String(sectionCount)
        var $newDiv = $("<div>", {id:secID});
        $("#degreeRequirement").append($newDiv);


        var newBreak = "<br>";
        var newHeader = "<h2>Degree Requirements</h2>";
        var electiveInput = "<input type='radio' value='elective'>Elective<br></br>";
        var majReqInput = "<input type='radio' value='degree requirement'> Major Requirement<br></br>";
        var degreeRequirementSection = "<div>Enter the Degree Requirement Section: <input type='text' name='degreeRequirements'></div>";
        var numCredits = "<b>Enter the number of credits for the section: </b><input type='text' name='degreeSectionHours' placeholder='Ex. 5'></input>";
        var newPrompt = "<b>Enter the name of the course: </b>";
        var newInput = "<input type='text' name='courseName' placeholder='Ex. CSCE 1030'>";
        var course = "<button class='addingCourse'> Add Another Course </button>";
 

        $("#"+secID).append(newBreak, newHeader, electiveInput, majReqInput, degreeRequirementSection, numCredits, newBreak, newPrompt, course, newInput, newBreak, newBreak);
    });

});
// controls the hero video on the home page
$(document).ready(function(){
    if($("#hero-feature").length != 0){
        $("#hero-feature").parent().removeClass("container");
    }
});

// hides need js banner unless js is disabled by the user
$(document).ready(function(){
        $("#no-js-banner").addClass("d-none");
});
// controls the site disclaimer for the home page
$(document).ready(function(){
    if(getCookie("sitedisclaimeraccept") != "True"){
    $("#modalDisclaimer").modal();
    }

    $(document).on("click", "#modalDisclaimerAccept", function(e){
        $("#modalDisclaimer").modal("toggle");
        create_cookie("sitedisclaimeraccept", "True");
    })
});

$(document).on("click", ".remover", function(e){
    e.preventDefault();
    console.log("removing");

    $(this).parent().remove()
});

$(document).on("click", ".addingCourse", function(e) {
    e.preventDefault();
    console.log("adding course");

    var newInput = "<input type='text' name='courseName' placeholder='Ex. CSCE 1030'>";
    $(this).parent().append(newInput)
})

$(".loading").click( function(){
    console.log("trying to load");
    $('<div>Loading</div>').prependTo(document.body);
});

function removeCoreSection(event) {
    console.log(event);    
}

function tst() {
    console.log("working")
}

function addCore(){
    console.log("unicore");
    
}

// credit: https://docs.djangoproject.com/en/3.0/ref/csrf/
function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// cookie management provided by QuirksMode
// link: http://www.quirksmode.org/js/cookies.html
function create_cookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
}

function erase_cookie(name) {
    create_cookie(name, "", -1);
}

// credit: https://docs.djangoproject.com/en/3.0/ref/csrf/
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

// credit: https://codepen.io/bewo
function sanatize(input) {
    return input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
                 replace(/<[\/\!]*?[^<>]*?>/gi, '').
                 replace(/<style[^>]*?>.*?<\/style>/gi, '').
                 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '').
                 replace(/&nbsp;/g, '');
}

// credit: https://stackoverflow.com/questions/3514784/what-is-the-best-way-to-detect-a-mobile-device
function checkIfMobileDevice() {
    var isMobile = false; //initiate as false
    // device detection
    if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent) 
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) { 
        isMobile = true;
    }
    return isMobile;
}

$(document).ready(function(data) {
    /*
    $(document).on('click', 'button.btn-block', function(e) {
        if($(this).text().toLowerCase().trim().indexOf("search") != -1){
            if($("input").eq(0).val().trim().length == 0){
                $("input").eq(0).attr("placeholder", "Field Required");
                 e.stopImmediatePropagation(); // halt other events from exec
            }
        }
        else {
            $("input").each(function(inputIndex) {
                if($(this).val().trim().length == 0){
                    $(this).attr("placeholder", "Field Required");
                 e.stopImmediatePropagation();
                }
            });
        }
    });
    */

    // code specific to the create session page
    if($("#search-degree").length && !$("#edit-session-title").length){
        $('#search-degree').val('');
        $('#session-submit-btn').prop('disabled', true);; //by default, disable the submit button
        var myInput = document.getElementById("create-session-pin");
        var mySearch = document.getElementById("search-degree");
        var isSearchSatisfied = false;
        var isPinFilled = false;
        var isPinSatisfied = false;
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
            check(isPinSatisfied,isPinFilled,isSearchSatisfied)
            //console.log("hey")
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
            check(isPinSatisfied,isPinFilled,isSearchSatisfied)
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
            check(isPinSatisfied,isPinFilled,isSearchSatisfied);

        }
        function check(isPinSatisfied,isPinFilled,isSearchSatisfied) //a non-elegant way of checking the conditions every user action
        {
            if((isPinSatisfied && isPinFilled && isSearchSatisfied) == true){
                $('#session-submit-btn').prop('disabled', false);
            }
            else{
                $('#session-submit-btn').prop('disabled', true);
            }
            //console.log("pinsat " + isPinSatisfied)
            //console.log("pinfilled " + isPinFilled)
            //console.log("search " + isSearchSatisfied)
        }
    }
});