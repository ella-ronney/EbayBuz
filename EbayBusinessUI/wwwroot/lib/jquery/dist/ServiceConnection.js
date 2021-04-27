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
$('#addReturn').on('click', function () {
    var inputData = $('input').serialize();
    var paymentMethod = $('#paymentMethod').val();
    inputData += '&paymentMethod=' + paymentMethod;
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/AddReturn',
        method: 'POST',
        data: JSON.stringify(inputData),
        success: function (data) {
            /*Clear out the form after submitting the info to db*/
            $("#returnName").val('');
            $("#quantity").val('');
            $("#totalPrice").val('');
            $("#returnVendor").val('');
            $("#deliveryDate").val('');
            $("#returnDate").val('');
            $("#estimatedRefundTime").val('');
            $("#trackingNum").val('');

            /*Display the newly added item in the table */
            var trHTML = '<tr><td hidden>' + data.idreturns + '</td><td>' + data.returnName + '</td><td>' + data.quantity + '</td><td>' + data.totalPrice + '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td>' + data.returnDate + '</td><td>' + data.deliveryDate + '</td><td>' + data.trackingNum + '</td><td>' + data.estimatedRefundTime + '</td></tr>';
            $('#returnTable').append(trHTML);
        }
    });
});
$.ajax({
    url: serviceUrl + 'ResolutionCenter/Returns',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        $.each(data, function (i, data) {
            trHTML += '<tr><td hidden>' + data.idreturns + '</td><td>' + data.returnName + '</td><td>' + data.quantity + '</td><td>' + data.totalPrice + '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td>' + data.returnDate + '</td><td>' + data.deliveryDate + '</td><td>' + data.trackingNum + '</td><td>' + data.estimatedRefundTime + '</td></tr>';
        });
        $('#returnTable').append(trHTML);
    }
});
$('#addInsuranceClaim').on('click', function () {
    var itemName = $('#itemName').val();
    var ebayOrderNumber = $('#ebayOrderNumber').val();
    var sellPrice = $('#sellPrice').val();
    var insuredFor = $('#insuredFor').val();
    var claimNumber = $('#claimNumber').val();
    var claimFileDate = $('#claimFileDate').val();
    var tracking = $('#tracking').val();
    var replacementTrackingNum = $('#replacementTrackingNum').val();
    var notes = $('#notes').val();
    var shippingCarrier = $('#shippingCarrier').val();
    var claimStatus = $('#claimStatus').val();
    var customerPreference = $('#customerPreference').val();
    var customerResolutionStatus = $('#customerResolutionStatus').val();
    var shippingCost = $('#shippingCost').val();
    // FIXME clean this up - refactor to a function or find a better solution
    var inputData = '&shippingCarrier=' + shippingCarrier + '&claimStatus=' + claimStatus + '&customerPreference=' + customerPreference + '&customerResolutionStatus=' + customerResolutionStatus
        + '&itemName=' + itemName + '&ebayOrderNumber=' + ebayOrderNumber + '&sellPrice=' + sellPrice + '&insuredFor=' + insuredFor + '&claimNumber=' + claimNumber + '&claimFileDate=' + claimFileDate
        + '&tracking=' + tracking + '&replacementTrackingNum=' + replacementTrackingNum + '&shippingCost=' + shippingCost +'&notes=' + notes;
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/AddInsuranceClaim',
        method: 'POST',
        data: JSON.stringify(inputData),
        success: function (data) {
            /*Clear out the form after submitting the info to db*/
            $("#itemName").val('');
            $("#ebayOrderNumber").val('');
            $("#sellPrice").val('');
            $("#insuredFor").val('');
            $("#claimNumber").val('');
            $("#claimFileDate").val('');
            $("#tracking").val('');
            $("#replacementTrackingNum").val('');
            $("#notes").val('');
            $("#shippingCost").val('');

            /*Display the newly added item in the table */
            var trHTML = '<tr><td hidden>' + data.idinsuranceclaims + '</td><td>' + data.itemName + '</td><td>' + data.ebayOrderNumber + '</td><td>' +
                data.sellPrice + '</td><td>' + data.insuredFor + '</td><td>' + data.shippingCarrier + '</td><td>' + data.shippingCost + '</td><td>' + data.tracking + '</td><td>' + data.claimNumber +
                '</td><td>' + data.claimFileDate + '</td><td>' + data.claimStatus + '</td><td>' + data.customerPreference + '</td><td>' + data.customerResolutionStatus + '</td><td>' + data.replacementTrackingNum + '</td><td>' + data.notes + '</td></tr>';
            $('#insuranceClaims').append(trHTML);
        }
    });
});
$.ajax({
    url: serviceUrl + 'ResolutionCenter/InsuranceClaims',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        $.each(data, function (i, data) {
            trHTML += '<tr><td hidden>' + data.idinsuranceclaims + '</td><td>' + data.itemName + '</td><td>' + data.ebayOrderNumber + '</td><td>' +
                data.sellPrice + '</td><td>' + data.insuredFor + '</td><td>' + data.shippingCarrier + '</td><td>' + data.shippingCost + '</td><td>' + data.tracking + '</td><td>' + data.claimNumber +
                '</td><td>' + data.claimFileDate + '</td><td>' + data.claimStatus + '</td><td>' + data.customerPreference + '</td><td>' + data.customerResolutionStatus + '</td><td>' + data.replacementTrackingNum + '</td><td>' + data.notes + '</td></tr>';
        });
        $('#insuranceClaims').append(trHTML);
    }
});