var serviceUrl = 'https://localhost:44388/';
var checkBoxes = 0;
var checkBoxesCur = 0;
var checkBoxesTop = 0; 
var checkBoxesReturns = 0;
var checkBoxesClaims = 0;
var checkBoxesDelays = 0;

function inventoryHtmlTableData(item) {
    var trHTML = '<tr><td hidden>' + item.idInventory + '</td><td contenteditable="true">' + item.name + '</td><td contenteditable="true">' + item.qty + '</td><td>' + item.pricePerPiece + '</td><td contenteditable="true">' + item.totalPrice + '</td><td>' + item.discountType + '</td><td contenteditable="true">' + item.discount
        + '</td><td>' + item.vendor + '</td><td>' + item.datePurchased + '</td><td>' + item.payment;
    return trHTML;
}

function createInventoryObject(IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, Vendor, DatePurchased, Payment, ReturnBy, Warranty, Classification,EstimatedDelivery, TrackingNumber, CurrentInventory) {
    var Inventory = {
        // FIXME - correct formating for dates
        idInventory: Number(IdInventory),
        name: Name,
        qty: parseFloat(Qty),
        pricePerPiece: parseFloat(PricePerPiece),
        totalPrice: parseFloat(TotalPrice),
        discountType: DiscountType,
        discount: parseFloat(Discount),
        vendor: Vendor,
        //datePurchased: null,
        payment: Payment,
        //returnBy: null,
        warranty: Warranty,
        classification: Classification,
        trackingNumber: TrackingNumber,
        //estimatedDelivery: null,
        ebayItemId: null,
        currentInventory: Number(CurrentInventory)
    };
    return Inventory;
}
    $.ajax({
        url: serviceUrl + 'inventory/CurrentInventory',
        method: 'GET',
        success: function (data) {
            var trHTML = '';
            var count = 1;
            $.each(data, function (i, item) {
                trHTML += inventoryHtmlTableData(item) + '</td><td contenteditable="true">' + item.returnBy + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + item.classification + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"</td></tr>';
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
            checkBoxesCur--;
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
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            var trHTML = '';
            var count = checkBoxesCur;
            document.querySelectorAll('#incominginvTable input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
            $.each(data, function (i, item) {
                trHTML += inventoryHtmlTableData(item) + '</td><td contenteditable="true">' + item.returnBy + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + item.classification + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"</td></tr>';
                count++;
            });
            checkBoxesCur = count;
            $('#currentinvTable').append(trHTML);

        }
    });
});

$('#updatecurrinv').on('click', function () {
    var updatedCurrentInvData = [];
    var curInventory = [];
    var selector = '#currentinvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateCurrentInv = $(this).parent().siblings();
        //Parameters (IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, Vendor, DatePurchased, Payment, ReturnBy, Warranty, Classification, EstimatedDelivery, TrackingNumber, CurrentInventory) 
       updatedCurrentInvData.push(createInventoryObject(toUpdateCurrentInv[0].innerHTML, toUpdateCurrentInv[1].innerHTML, toUpdateCurrentInv[2].innerHTML, toUpdateCurrentInv[3].innerHTML, toUpdateCurrentInv[4].innerHTML, toUpdateCurrentInv[5].innerHTML,
            toUpdateCurrentInv[6].innerHTML, toUpdateCurrentInv[7].innerHTML, toUpdateCurrentInv[8].innerHTML, toUpdateCurrentInv[9].innerHTML, toUpdateCurrentInv[10].innerHTML,
        toUpdateCurrentInv[11].innerHTML, toUpdateCurrentInv[12].innerHTML,null,null,1));
    });
    curInventory = { Inventory: updatedCurrentInvData };
    $.ajax({
        url: serviceUrl + 'inventory/UpdateCurrentInv',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(curInventory.Inventory),
        success: function (data) {
            if (data == true) {
                // popup update was successful
                $.each($(selector), function (i, checkbox) {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                    }
                });
            }
            // failed case - popup with when the updated failed 
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
            trHTML += inventoryHtmlTableData(item) + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + item.classification + '</td><td contenteditable="true">' + item.estimatedDelivery + '</td><td contenteditable="true">' + item.trackingNumber+'</td><td>' + '<input type="checkbox" name="check' + count + '"</td></tr>';
            count ++;
        });
        checkBoxes = count;
        $('#incominginvTable').append(trHTML);
    }
});

$('#addingincominginv').on('click', function () {
    var inputData = $('input').serialize();
    inputData += '&discountType=' + $('#discountType').val() + '&payment=' + $('#payment').val() + '&classification=' + $('#classification').val();
    $.ajax({
        url: serviceUrl + 'inventory/AddIncomingInventory',
        method: 'POST',
        data: JSON.stringify(inputData),
        success: function (item) {

            /*Clear out the form after submitting the info to db*/
            $("#name").val('');
            $("#qty").val('');
            $("#pricePerPiece").val('');
            $("#totalPrice").val('');
            $("#discount").val('');
            $("#vendor").val('');
            $("#datePurchased").val('');
            $("#warranty").val('');
            $("#estimatedDelivery").val('');
            $("#trackingNumber").val('');

            /*Display the newly added item in the table */
            var trHTML = inventoryHtmlTableData(item) + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + item.classification + '</td><td contenteditable="true">' + item.estimatedDelivery + '</td><td contenteditable="true">' + item.trackingNumber + '</td><td>' + '<input type="checkbox" name="check' + checkBoxes + '"</td></tr>';
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
                checkBoxes--;
            }
        });
});

$('#updateincominginv').on('click', function () {
    var updatedIncomingInvData = [];
    var incomingInv = [];
    var selector = '#incominginvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateIncomingInv = $(this).parent().siblings();

         //Parameters (IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, Vendor, DatePurchased, Payment, ReturnBy, Warranty, Classification, EstimatedDelivery, TrackingNumber, CurrentInventory) 
        updatedIncomingInvData.push(createInventoryObject(toUpdateIncomingInv[0].innerHTML, toUpdateIncomingInv[1].innerHTML, toUpdateIncomingInv[2].innerHTML, toUpdateIncomingInv[3].innerHTML, toUpdateIncomingInv[4].innerHTML, toUpdateIncomingInv[5].innerHTML,
            toUpdateIncomingInv[6].innerHTML, toUpdateIncomingInv[7].innerHTML, toUpdateIncomingInv[8].innerHTML, toUpdateIncomingInv[9].innerHTML, null, toUpdateIncomingInv[10].innerHTML,
            toUpdateIncomingInv[11].innerHTML, toUpdateIncomingInv[12].innerHTML, toUpdateIncomingInv[13].innerHTML,0))
    });
    incomingInv = { Inventory: updatedIncomingInvData };
    $.ajax({
        url: serviceUrl + 'inventory/UpdateIncomingInv',
        method: 'PUT',
        contentType: "application/json",
        data: JSON.stringify(incomingInv.Inventory),
        success: function (data) {
            $.each($(selector), function (i, checkbox) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                }
            });
        }
    });
});

// Top sellers
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

// Business expense manager
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
// Resolution Center - Returns
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
            var trHTML = '<tr><td hidden>' + data.idreturns + '</td><td>' + data.returnName + '</td><td>' + data.quantity + '</td><td>' +
                data.totalPrice + '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td>' + data.returnDate + '</td><td>' + data.deliveryDate +
                '</td><td>' + data.trackingNum + '</td><td>' + data.estimatedRefundTime + '</td><td>' +'<input type="checkbox" name="checkBoxesReturns' + checkBoxesReturns +'"</td></tr>';
            $('#returnTable').append(trHTML);
            checkBoxesReturns++;
        }
    });
});
$.ajax({
    url: serviceUrl + 'ResolutionCenter/Returns',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, data) {
            trHTML += '<tr><td hidden>' + data.idreturns + '</td><td contenteditable="true">' + data.returnName + '</td><td>' + data.quantity + '</td><td>' + data.totalPrice +
                '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td>' + data.returnDate + '</td><td>' + data.deliveryDate +
                '</td><td>' + data.trackingNum + '</td><td>' + data.estimatedRefundTime + '</td><td>' + '<input type="checkbox" name="checkBoxesReturns' + count + '"</td></tr>';
            count++;
        });
        checkBoxesReturns = count;
        $('#returnTable').append(trHTML);
    }
});

$('#deleteReturn').on('click', function () {
    var returnIds = [];
    var selector = '#returnTable tr input:checked';
    $.each($(selector), function (i, item) {
        var returnId = $(this).parent().siblings(":first").text();
        returnIds.push(returnId);
    });
    var idList = { ids: returnIds.toString() };
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/DeleteReturn',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#returnTable input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
            checkBoxesReturns--;
        }
    });
});

// Resolution center - insurance claims
$('#addInsuranceClaim').on('click', function () {
    var formData = $('input').serialize();
    var splitted = formData.split('idinsuranceclaims');
    var inputData = 'idinsuranceclaims' + splitted[1];
    var shippingCarrier = $('#shippingCarrier').val();
    var claimStatus = $('#claimStatus').val();
    var customerPreference = $('#customerPreference').val();
    var customerResolutionStatus = $('#customerResolutionStatus').val();
    inputData += '&shippingCarrier=' + shippingCarrier + '&claimStatus=' + claimStatus + '&customerPreference=' +
        customerPreference + '&customerResolutionStatus=' + customerResolutionStatus;
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
                '</td><td>' + data.claimStatus + '</td><td>' + data.claimFileDate + '</td><td>' + data.customerPreference + '</td><td>' +
                data.customerResolutionStatus + '</td><td>' + data.replacementTrackingNum + '</td><td>' + data.notes + '</td><td>' + '<input type="checkbox" name="checkBoxesClaims' + checkBoxesClaims + '"</td></tr>';
            $('#insuranceClaims').append(trHTML);
            checkBoxesClaims++;
        }
    });
});
$.ajax({
    url: serviceUrl + 'ResolutionCenter/InsuranceClaims',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, data) {
            trHTML += '<tr><td hidden>' + data.idinsuranceclaims + '</td><td>' + data.itemName + '</td><td>' + data.ebayOrderNumber + '</td><td>' +
                data.sellPrice + '</td><td>' + data.insuredFor + '</td><td>' + data.shippingCarrier + '</td><td>' + data.shippingCost + '</td><td>' + data.tracking + '</td><td>' + data.claimNumber +
                '</td><td>' + data.claimStatus + '</td><td>' + data.claimFileDate + '</td><td>' + data.customerPreference + '</td><td>' + data.customerResolutionStatus + '</td><td>' +
                data.replacementTrackingNum + '</td><td>' + data.notes + '</td><td>' + '<input type="checkbox" name="checkBoxesClaims' + checkBoxesClaims + '"</td></tr>';
            count++;
        });
        checkBoxesClaims = count;
        $('#insuranceClaims').append(trHTML);
    }
});

$('#deleteInsuranceClaim').on('click', function () {
    var claimIds = [];
    var selector = '#insuranceClaims tr input:checked';
    $.each($(selector), function (i, item) {
        var claimId = $(this).parent().siblings(":first").text();
        claimIds.push(claimId);
    });
    var idList = { ids: claimIds.toString() };
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/DeleteInsuranceClaim',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#insuranceClaims input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
            checkBoxesClaims--;
        }
    });
});

// Resolution center - Delayed packages
$('#addDelayedPackage').on('click', function ()
{
    var formData = $('input').serialize();
    var splitString = formData.split('idshippingdelayedpackages');
    var inputData = 'idshippingdelayedpackages' + splitString[1];
    inputData += '&carrier=' + $('#carrier').val(); 
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/AddDelayedPackage',
        method: 'POST',
        data: JSON.stringify(inputData),
        success: function (data) {
            /*Clear out the form after submitting the info to db*/
            $("#packageName").val('');
            $("#ebayOrderNum").val('');
            $("#insuranceVal").val('');
            $("#trackingId").val('');
            $("#lastScanDate").val('');
            $("#currentLoc").val('');
            $("#destination").val('');
            $("#serviceReqNum").val('');
            $("#lastCustomerContactDate").val('');
            $("#note").val('');

            /*Display the newly added item in the table */
            var trHTML = '<tr><td hidden>' + data.idshippingdelayedpackages + '</td><td>' + data.packageName + '</td><td>' + data.ebayOrderNum + '</td><td>' +
                data.carrier + '</td><td>' + data.insuranceVal + '</td><td>' + data.trackingId + '</td><td>' + data.lastScanDate + '</td><td>' + data.currentLoc + '</td><td>' + data.destination +
                '</td><td>' + data.serviceReqNum + '</td><td>' + data.lastCustomerContactDate + '</td><td>' + data.note + '</td><td>' + '<input type="checkbox" name="checkBoxesDelays' + checkBoxesDelays + '"</td></tr>';
            $('#delayedPackages').append(trHTML);
            checkBoxesDelays++;
        }
    });
});
$.ajax({
    url: serviceUrl + 'ResolutionCenter/DelayedPackages',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, data) {
            trHTML += '<tr><td hidden>' + data.idshippingdelayedpackages + '</td><td>' + data.packageName + '</td><td>' + data.ebayOrderNum + '</td><td>' +
                data.carrier + '</td><td>' + data.insuranceVal + '</td><td>' + data.trackingId + '</td><td>' + data.lastScanDate + '</td><td>' + data.currentLoc + '</td><td>' + data.destination +
                '</td><td>' + data.serviceReqNum + '</td><td>' + data.lastCustomerContactDate + '</td><td>' + data.note + '</td><td>' + '<input type="checkbox" name="checkBoxesDelays' + checkBoxesDelays + '"</td></tr>';
            count++;
        });
        checkBoxesDelays = count;
        $('#delayedPackages').append(trHTML);
    }
});
$('#deleteDelayedPackage').on('click', function () {
    var delayedPackageIdList = [];
    var selector = '#delayedPackages tr input:checked';
    $.each($(selector), function (i, item) {
        var delayedPackageId = $(this).parent().siblings(":first").text();
        delayedPackageIdList.push(delayedPackageId);
    });
    var idList = { ids: delayedPackageIdList.toString() };
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/DeleteDelayedPackage',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#delayedPackages input:checked').forEach(e => {
                e.parentNode.parentNode.remove()
            });
            checkBoxesDelays--;
        }
    });
});