$(document).ready(function() {
    $(".btn-arrive").bind('click', function() {
        event.preventDefault();
        var form = $(this).parents('form:first');
        
        form.submit(function() {
            console.log("Form submitted");
        });
        
        var data = JSON.stringify({
            stopId: this.value
        });
        $.ajax({
            type: "POST",
            url: "/arrive",
            processData: false,
            contentType: "application/json; charset=utf-8",
            data: data,
            // this affects "success" callback, what the fish?
            // dataType: "json",
            success: function(r) {
                alert("Passengers are being alerted");
            }
        });
    });

    $("#switch").bind('click', function() {
        var password = window.prompt("Please enter password", "");
        var data = JSON.stringify({
            password: password
        });
        if (this.innerHTML === "Shutdown MiddRides") {
            $.ajax({
                type: "POST",
                url: "/shutdown",
                processData: false,
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                success: function(r) {
                    alert("Server has been shut down");
                    $("#switch").html("Turn on MiddRides");
                }
            });
        } else {
            $.ajax({
                type: "POST",
                url: "/turnon",
                processData: false,
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: "json",
                success: function(r) {
                    alert("Server has been turned on");
                    $("#switch").html("Shutdown MiddRides");
                }
            });
        }
    });

});

/**
 * Ask server for number of people waiting at each stop
 */
function getWaiting() {
    $.ajax({
        type: "GET",
        url: "/getwaiting",
        processData: false,
        contentType: "application/json; charset=utf-8",
        success: function(r) {
            for (var i = 0; i < r.stops.length; i++) {
                var stop = r.stops[i];
                var td = $('#' + stop.stopId).find('td.num-waiting');
                if (parseInt(td.html()) !== stop.numWaiting) {
                    td.html(stop.numWaiting);
                    td.animate({ backgroundColor: "#00FF00" }, 500);
                    setInterval(function() {
                        td.animate({ backgroundColor: "#FFFFFF" }, 500);
                    }, 1000);
                }
            }
        }
    });
}

setInterval(getWaiting, 3e4);   // every 30 seconds