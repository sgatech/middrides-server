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
});