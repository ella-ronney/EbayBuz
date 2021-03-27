    var serviceUrl = 'https://localhost:44388/inventory';
    $.ajax({
        url: serviceUrl + '/CurrentInventory',
        method: 'GET',
        success: function (data) {
            var trHTML = '';
            $.each(data, function (i, item) {
                trHTML += '<tr><td>' + item.name + '</td><td>' + item.qty + '</td><td>' + item.price + '</td><td>' + item.vendor + '</td><td>' + item.purchaseDate + '</td><td>' + item.warranty + '</td><td>' + item.serialNumbers + '</td></tr>';
            });
            $('#currentinvTable').append(trHTML);
        }
    });
$.ajax({
    url: serviceUrl + '/IncomingInventory',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        $.each(data, function (i, item) {
            trHTML += '<tr><td>' + item.name + '</td><td>' + item.qty + '</td><td>' + item.price + '</td><td>' + item.vendor + '</td><td>' + item.purchaseDate + '</td><td>' + item.warranty + '</td><td>' + item.serialNumbers + '</td><td>' + item.trackingNumber + '</td></tr>';
        });
        $('#incominginvTable').append(trHTML);
    }
});

$('#addingcominginv').on('click', function () {
    var inputData = $('input').serialize();
    $.ajax({
        url: serviceUrl + '/AddIncomingInventory',
        method: 'POST',
        data: JSON.stringify(inputData),
        success: function (data) {

            /*Clear out the form after submitting the info to db*/
            $("#name").val('');
            $("#qty").val('');
            $("#price").val('');
            $("#vendor").val('');
            $("#purchasedate").val('');
            $("#warranty").val('');
            $("#serialnumbers").val('');
            $("#trackingnumber").val('');

            /*Display the newly added item in the table */
            var trHTML = '<tr><td>' + data.name + '</td><td>' + data.qty + '</td><td>' + data.price + '</td><td>' + data.vendor + '</td><td>' + data.purchaseDate + '</td><td>' + data.warranty + '</td><td>' + data.serialNumbers + '</td><td>' + data.trackingNumber + '</td></tr>';
            $('#incominginvTable').append(trHTML);
        }
    });
});

