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
            processData: true,
            contentType: "application/json; charset=utf-8",
            data: data,
            dataType: "json",
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