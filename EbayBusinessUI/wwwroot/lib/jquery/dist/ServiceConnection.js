var serviceUrl = 'https://localhost:44388/';
var checkBoxes = 0;
var checkBoxesCur = 0;
var checkBoxesTop = 0; 
    $.ajax({
        url: serviceUrl + 'inventory/CurrentInventory',
        method: 'GET',
        success: function (data) {
            var trHTML = '';
            var count = 1;
            $.each(data, function (i, item) {
                trHTML += '<tr><td hidden>' + item.idCurrentInventory + '</td><td>'+ item.name + '</td><td>' + item.qty + '</td><td>' + item.price + '</td><td>' + item.vendor + '</td><td>' + item.purchaseDate + '</td><td>' + item.warranty + '</td><td>' + item.serialNumbers + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"</td></tr>';
                count++;
            });
            checkBoxesCur = count;
            $('#currentinvTable').append(trHTML);
        }
    });

$('#deletecurrentinv').on('click', function () {
    var currentInventoryIds = [];
    var selector = '#currentinvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var currentInventoryId = $(this).parent().siblings(":first").text();
        currentInventoryIds.push(currentInventoryId);
    });
    var idList = { ids: currentInventoryIds.toString() };
    $.ajax({
        url: serviceUrl + 'inventory/DeleteCurrentInventory',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#currentinvTable input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
        }
    });
});

$('#movetocurrentinv').on('click', function () {
    var incomingInventoryIds = [];
    var selector = '#incominginvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var incomingInventoryId = $(this).parent().siblings(":first").text();
        incomingInventoryIds.push(incomingInventoryId);
    });
    var idList = { ids: incomingInventoryIds.toString() };
    $.ajax({
        url: serviceUrl + 'inventory/MoveToCurrentInventory',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            var trHTML = '';
            var count = checkBoxesCur;
            document.querySelectorAll('#incominginvTable input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
            $.each(data, function (i, item) {
                trHTML += '<tr><td hidden>' + item.idCurrentInventory + '</td><td>' + item.name + '</td><td>' + item.qty + '</td><td>' + item.price + '</td><td>' + item.vendor + '</td><td>' + item.purchaseDate + '</td><td>' + item.warranty + '</td><td>' + item.serialNumbers + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"</td></tr>';
                count++;
            });
            checkBoxesCur = count;
            $('#currentinvTable').append(trHTML);

        }
    });
});

$.ajax({
    url: serviceUrl + 'inventory/IncomingInventory',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, item) {
            trHTML += '<tr><td hidden>' + item.idIncomingInventory + '</td><td>'+ item.name + '</td><td>' + item.qty + '</td><td>' + item.price + '</td><td>' + item.vendor + '</td><td>' + item.purchaseDate + '</td><td>' + item.warranty + '</td><td>' + item.serialNumbers + '</td><td>' + item.trackingNumber + '</td><td>' + '<input type="checkbox" name="check' + count + '"</td></tr>';
            count ++;
        });
        checkBoxes = count;
        $('#incominginvTable').append(trHTML);
    }
});

$('#addingincominginv').on('click', function () {
    var inputData = $('input').serialize();
    $.ajax({
        url: serviceUrl + 'inventory/AddIncomingInventory',
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
            var trHTML = '<tr><td hidden>' + data.idIncomingInventory + '</td><td>' + data.name + '</td><td>' + data.qty + '</td><td>' + data.price + '</td><td>' + data.vendor + '</td><td>' + data.purchaseDate + '</td><td>' + data.warranty + '</td><td>' + data.serialNumbers + '</td><td>' + data.trackingNumber + '</td><td>' + '<input type="checkbox" name="check' + checkBoxes + '"</td></tr>';
            $('#incominginvTable').append(trHTML);
            checkBoxes++;
        }
    });
});

$('#deleteincominginv').on('click', function () {
    var incomingInventoryIds = [];
    var selector = '#incominginvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var incomingInventoryId = $(this).parent().siblings(":first").text();
        incomingInventoryIds.push(incomingInventoryId);
    });
    var idList = { ids: incomingInventoryIds.toString() };
        $.ajax({
            url: serviceUrl + 'inventory/DeleteIncomingInventory', 
            method: 'POST',
            contentType: "application/json",
            data: JSON.stringify(idList),
            success: function (data) {
                document.querySelectorAll('#incominginvTable input:checked').forEach(e => {
                    e.parentNode.parentNode.remove()
                });
            }
        });
    });

$.ajax({
    url: serviceUrl + 'TopSellers/GetTopSellers',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, item) {
            trHTML += '<tr><td hidden>' + item.idTopSellers + '</td><td>' + item.tname + '</td><td>' + item.priceSold + '</td><td>' + item.purchasePrice + '</td><td>' + item.vendors +'</td><td>' + '<input type="checkbox" name="checktop' + count + '"</td></tr>';
            count++;
        });
        checkBoxesTop = count;
        $('#topSellerTable').append(trHTML);
    }
});
$('#addExpense').on('click', function () {
    var dataType = 'application/x-www-form-urlencoded; charset=utf-8';
    var inputData = $('input').serialize();
    var category = $('#expenseCategory').val();
    var paymentInfo = $('#paymentInfo').val();
    inputData += '&expenseCategory=' + category + '&paymentInfo=' + paymentInfo;
    $.ajax({
        url: serviceUrl + 'BusinessExpenses/AddExpense',
        method: 'POST',
        contentType: dataType,
        data: JSON.stringify(inputData),
        success: function (data) {
            // clear the text box fields
            $("#expenseName").val('');
            $("#cost").val('');
            $("#purchaseDate").val('');
            $("#percentTowardTaxReturn").val('');
        }
    });
});