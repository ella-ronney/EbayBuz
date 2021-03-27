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
