

/* Attributes */
var serviceUrl = 'https://localhost:44388/';
var checkBoxes = 0;
var checkBoxesCur = 0;
var checkBoxesTop = 0; 
var checkBoxesReturns = 0;
var checkBoxesClaims = 0;
var checkBoxesDelays = 0;
var checkBoxesBadSellers = 0;
var jamoCheckBox = 0;
var klipschCheckBox = 0;

/* General Helper Functions */
function formatDateString(dateString) {
    // Date format yyyy-mm-dd
    var returnBy = dateString.substr(0, 10);
    return returnBy;
}

/* End - General Helper Functions */

// ---------------------------- Inventory Controller --------------------------------------------------------------------------------- //

/* Helper Functions */
function inventoryHtmlTableData(item) {
    var trHTML = '<tr><td hidden>' + item.idInventory + '</td><td contenteditable="true">' + item.name + '</td><td contenteditable="true">' + item.qty + '</td><td>' + item.pricePerPiece + '</td><td contenteditable="true">' + item.totalPrice + '</td><td>' + item.salesTax + '</td><td>'+ item.salesTaxRefunded + '</td><td>' + item.discountType + '</td><td contenteditable="true">' + item.discount
        + '</td><td contenteditable="true"><select>';
    switch (item.discountStatus) {
        case "Approved":
            trHTML += '<option selected>Approved</option><option>Email Appeal</option><option>Pending</option></select ></td><td>';
            break;
        case "Pending":
            trHTML += '<option>Approved</option><option>Email Appeal</option><option selected>Pending</option></select ></td><td>';
            break;
        default:
            // last option - email appeal
            trHTML += '<option>Approved</option><option selected>Email Appeal</option><option>Pending</option></select ></td><td>';
    }
    trHTML += item.vendor + '</td><td>' + item.datePurchased + '</td><td>' + item.payment;
    // + item.discountStatus + '</td><td>' + item.vendor + '</td><td>' + item.datePurchased + '</td><td>' + item.payment;
    return trHTML;
}

function createInventoryObject(IdInventory, Name, Qty, PricePerPiece, TotalPrice, SalesTax, SalesTaxRefunded, DiscountType, Discount, DiscountStatus, Vendor, DatePurchased, Payment, ReturnBy, Warranty, Classification, EstimatedDelivery, TrackingNumber, CurrentInventory) {
    var Inventory = {
        // FIXME - correct formating for dates
        idInventory: Number(IdInventory),
        name: Name,
        qty: parseFloat(Qty),
        pricePerPiece: parseFloat(PricePerPiece),
        totalPrice: parseFloat(TotalPrice),
        salesTax: parseFloat(SalesTax),
        salesTaxRefunded: Number(SalesTaxRefunded),
        discountType: DiscountType,
        discount: parseFloat(Discount),
        discountStatus: DiscountStatus,
        vendor: Vendor,
        //datePurchased: null,
        payment: Payment,
        returnBy: new Date(ReturnBy),
        warranty: Warranty,
        classification: Classification,
        trackingNumber: TrackingNumber,
        estimatedDelivery: new Date(EstimatedDelivery),
        ebayItemId: null,
        currentInventory: Number(CurrentInventory)
    };
    return Inventory;
}

function formatClassificationsHTMLTag(classification) {
    var htmlClassificationTag = null;
    switch (classification) {
        case "Fast seller":
            htmlClassificationTag = '<select><option selected> Fast seller</option><option>Slow seller</option><option>Possible return</option><option>Bad seller</option></select >';
            break;
        case "Slow seller":
            htmlClassificationTag = '<select><option> Fast seller</option><option selected>Slow seller</option><option>Possible return</option><option>Bad seller</option></select >';
            break;
        case "Possible return":
            htmlClassificationTag = '<select><option> Fast seller</option><option>Slow seller</option><option selected>Possible return</option><option>Bad seller</option></select >';
            break;
        case "Bad seller":
            htmlClassificationTag = '<select><option> Fast seller</option><option>Slow seller</option><option>Possible return</option><option selected>Bad seller</option></select >';
            break;
        default:
            htmlClassificationTag = '<select><option> Fast seller</option><option>Slow seller</option><option>Possible return</option><option>Bad seller</option></select >';
    }
    return htmlClassificationTag;
}

/* End - Helper Functions */

// Current Inventory
$.ajax({
    url: serviceUrl + 'inventory/CurrentInventory',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, item) {
            var date = formatDateString(item.returnBy);
            var classification = formatClassificationsHTMLTag(item.classification);
            trHTML += inventoryHtmlTableData(item) + '</td><td contenteditable="true">' + '<input type="date" value="' + date + '"/>' + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + classification + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"/></td></tr>';
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
                e.parentNode.parentNode.remove();
                checkBoxesCur--;
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
                var date = formatDateString(item.returnBy);
                var classification = formatClassificationsHTMLTag(item.classification);
                trHTML += inventoryHtmlTableData(item) + '</td><td contenteditable="true">' + '<input type="date" value="' + date + '"/>' + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + classification + '</td><td>' + '<input type="checkbox" name="checkcur' + count + '"/></td></tr>';
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

        // Parameters (0 IdInventory, 1 Name, 2 Qty, 3 PricePerPiece, 4 TotalPrice, 5 SalesTax, 6 SalesTaxRefunded, 7 DiscountType, 8 Discount, 9 DiscountStatus, 10 Vendor, 11 DatePurchased - not editable, 12 Payment, 13 ReturnBy, 14 Warranty, 15 Classification, 16 EstimatedDelivery - null dne, 17 TrackingNumber - null dne, 18 CurrentInventory - 1 ) 
        // Editable fields (1 Name, 2 Qty, 4 TotalPrice, 6 SalesTaxRefunded, 8 Discount, 9 DiscountStatus, 13 ReturnBy, 15 Classification  )
        updatedCurrentInvData.push(createInventoryObject(toUpdateCurrentInv[0].innerHTML, toUpdateCurrentInv[1].innerHTML, toUpdateCurrentInv[2].innerHTML, toUpdateCurrentInv[3].innerHTML, toUpdateCurrentInv[4].innerHTML, toUpdateCurrentInv[5].innerHTML,
            toUpdateCurrentInv[6].children[0].value, toUpdateCurrentInv[7].innerHTML, toUpdateCurrentInv[8].innerHTML, toUpdateCurrentInv[9].children[0].value, toUpdateCurrentInv[10].innerHTML,
            toUpdateCurrentInv[11].innerHTML, toUpdateCurrentInv[12].innerHTML, toUpdateCurrentInv[13].innerHTML, toUpdateCurrentInv[14].innerHTML, toUpdateCurrentInv[15].children[0].value, null, null, 1));
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

// Incoming Inventory
$.ajax({
    url: serviceUrl + 'inventory/IncomingInventory',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, item) {
            var classification = formatClassificationsHTMLTag(item.classification);
            var estimatedDelivery = formatDateString(item.estimatedDelivery);
            trHTML += inventoryHtmlTableData(item) + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + classification + '</td><td contenteditable="true">' + '<input type="date" value="' + estimatedDelivery + '"/>' + '</td><td contenteditable="true">' + item.trackingNumber + '</td><td>' + '<input type="checkbox" name="check' + count + '"/></td></tr>';
            count++;
        });
        checkBoxes = count;
        $('#incominginvTable').append(trHTML);
    }
});

$('#addingincominginv').on('click', function () {
    var inputData = $('input').serialize();
    inputData += '&discountType=' + $('#discountType').val() + '&discountStatus=' + $('#discountStatus').val() + '&payment=' + $('#payment').val() + '&classification=' + $('#classification').val();
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
            $("#salesTax").val('');
      
            /*Display the newly added item in the table */
            var classification = formatClassificationsHTMLTag(item.classification);
            var estimatedDelivery = formatDateString(item.estimatedDelivery);
            var trHTML = inventoryHtmlTableData(item) + '</td><td>' + item.warranty + '</td><td contenteditable="true">' + classification + '</td><td contenteditable="true">' + '<input type="date" value="' + estimatedDelivery + '"/>' + '</td><td contenteditable="true">' + item.trackingNumber + '</td><td>' + '<input type="checkbox" name="check' + checkBoxes + '"/></td></tr>';
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
                e.parentNode.parentNode.remove();
                checkBoxes--;
            });
        }
    });
});

$('#updateincominginv').on('click', function () {
    var updatedIncomingInvData = [];
    var incomingInv = [];
    var selector = '#incominginvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateIncomingInv = $(this).parent().siblings();

        // Parameters (0 IdInventory, 1 Name, 2 Qty, 3 PricePerPiece, 4 TotalPrice, 5 SalesTax, 6 SalesTaxRefunded, 7 DiscountType, 8 Discount, 9 DiscountStatus, 10 Vendor, 11 DatePurchased - null bc not editable, 12 Payment, 13 ReturnBy - null dne for incoming inv, 14 Warranty, 15 Classification, 16 EstimatedDelivery, 17 TrackingNumber, 18 CurrentInventory) 
        // Editable Fields (1 Name, 2 Qty, 4 TotalPrice, 6 SalesTaxRefunded, 8 Discount, 9 DiscountStatus, 15 Classification, 16 EstimatedDeliveryDate, 17 Tracking  )
        updatedIncomingInvData.push(createInventoryObject(toUpdateIncomingInv[0].innerHTML, toUpdateIncomingInv[1].innerHTML, toUpdateIncomingInv[2].innerHTML, toUpdateIncomingInv[3].innerHTML, toUpdateIncomingInv[4].innerHTML, toUpdateIncomingInv[5].innerHTML, toUpdateIncomingInv[6].children[0].value, toUpdateIncomingInv[7].innerHTML,
            toUpdateIncomingInv[8].innerHTML, toUpdateIncomingInv[9].children[0].value, toUpdateIncomingInv[10].innerHTML, null, toUpdateIncomingInv[12].innerHTML, null,
            toUpdateIncomingInv[14].innerHTML, toUpdateIncomingInv[15].children[0].value, toUpdateIncomingInv[16].innerHTML, toUpdateIncomingInv[17].innerHTML, 0))
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


// ---------------------------- SellingStats Controller ------------------------------------------------------------------------------ //

/* Helper Functions */

/* End - Helper Functions */

// Top sellers
/*$.ajax({
    url: serviceUrl + 'SellingStats/GetTopSellers',
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
});*/

$('#addBadSeller').on('click', function () {
    var SoldItem = {
        itemName: $('#itemName').val(),
        category: 'bad seller'
    };
    $.ajax({
        url: serviceUrl + 'SellingStats/AddBadSeller',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(SoldItem),
        success: function (data) {
            $('#itemName').val('');
            var trHTML = '<tr><td hidden>' + data.idsolditems + '</td><td>' + data.itemName + '</td><td>' + '<input type="checkbox" name="checkbad' + checkBoxesBadSellers + '"/></td></tr>';
            $('#badSellerTable').append(trHTML);
            checkBoxesBadSellers++;
        }
    });
});

$('#deleteBadSeller').on('click', function () {
    var badSellerIds = [];
    var selector = '#badSellerTable tr input:checked';
    $.each($(selector), function (i, badSeller) {
        var badSellerId = $(this).parent().siblings(":first").text();
        badSellerIds.push(badSellerId);
    });
    var idList = { ids: badSellerIds.toString() };
    $.ajax({
        url: serviceUrl + 'SellingStats/DeleteBadSeller',
        method: 'DELETE',
        contentType: "application/json",
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#badSellerTable input:checked').forEach(x => {
                x.parentNode.parentNode.remove();
                // FIXME implement for the rest
                checkBoxesBadSellers--;
            });
        }
    });
});

$.ajax({
    url: serviceUrl + 'SellingStats/GetBadSellers',
    method: 'GET',
    success: function (data) {
        var trHTML = '';
        var count = 1;
        $.each(data, function (i, item) {
            trHTML += '<tr><td hidden>' + item.idsolditems + '</td><td>' + item.itemName + '</td><td>' + '<input type="checkbox" name="checkbad' + count + '"/></td></tr>';
            count++;
        });
        checkBoxesBadSellers = count;
        $('#badSellerTable').append(trHTML);
    }
});


// ---------------------------- Warranty Controller ---------------------------------------------------------------------------------- //

/* Helper Functions */

/* End - Helper Functions */

// ---------------------------- Business Expense Controller -------------------------------------------------------------------------- //

/* Helper Functions */

/* End - Helper Functions */
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

// ---------------------------- Resolution Center Controller ------------------------------------------------------------------------- //

/* Helper Functions */

// Returns
function createReturnObject(IdReturns, ReturnName, ReturnDate, EstimatedRefundTime, DeliveryDate) {
    var Returns = {
        idReturns: Number(IdReturns),
        returnName: ReturnName,
        returnDate: new Date(ReturnDate),
        estimatedRefundTime: EstimatedRefundTime,
        deliveryDate: new Date(DeliveryDate)
    };
    return Returns;
}

function returnHtmlTableData(data) {
    var returnDate = formatDateString(data.returnDate);
    var deliveryDate = formatDateString(data.deliveryDate);
    var trHTML = '<tr><td hidden>' + data.idreturns + '</td><td contenteditable="true">' + data.returnName + '</td><td>' + data.quantity + '</td><td>' + data.totalPrice +
        '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td contenteditable="true">' + '<input type="date" value="' + returnDate + '"/>' + '</td><td contenteditable="true">' +'<input type="date" value="'+ deliveryDate +
        '"/></td><td>' + data.trackingNum + '</td><td contenteditable="true">' + data.estimatedRefundTime + '</td><td>';
    return trHTML;
}

// Insurance Claims
function createInsuranceClaimObject(IDInsuranceClaims, ItemName, InsuredFor, ClaimStatus, CustomerPreference, CustomerResolutionStatus, Notes, ReplacementTrackingNum) {
    var InsuranceClaims = {
        idinsuranceclaims: Number(IDInsuranceClaims),
        itemName: ItemName,
        insuredFor: parseFloat(InsuredFor),
        claimStatus: ClaimStatus,
        customerPreference: CustomerPreference,
        customerResolutionStatus: CustomerResolutionStatus,
        notes: Notes,
        replacementTrackingNum: ReplacementTrackingNum
    };
    return InsuranceClaims;
}

function InsuranceClaimHTMLData(data) {
    var claimStatus = formatInsuranceClaimStatusHTMLTag(data.claimStatus);
    var customerPreference = formatInsuranceClaimCustomerPref(data.customerPreference);
    var customerResolutionStatus = formatInsuranceClaimCustomerResStatus(data.customerResolutionStatus);
    var trHTML = '<tr><td hidden>' + data.idinsuranceclaims + '</td><td contenteditable="true">' + data.itemName + '</td><td>' + data.ebayOrderNumber + '</td><td>' +
        data.sellPrice + '</td><td contenteditable="true">' + data.insuredFor + '</td><td>' + data.shippingCarrier + '</td><td>' + data.shippingCost + '</td><td>' + data.tracking + '</td><td>' + data.claimNumber +
        '</td><td contenteditable="true">' + claimStatus + '</td><td>' + data.claimFileDate + '</td><td contenteditable="true">' + customerPreference + '</td><td contenteditable="true">' +
        customerResolutionStatus + '</td><td contenteditable="true">' + data.replacementTrackingNum + '</td><td contenteditable="true">' + data.notes + '</td><td>';
    return trHTML;
}               

function formatInsuranceClaimStatusHTMLTag(claimStatus) {
    var trHTML = '';
    switch (claimStatus) {
        case "Filed awaiting decision":
           trHTML = '<select><option selected>Filed awaiting decision</option><option>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option>Check cashed</option><option>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
        case "Need additional documents":
            trHTML = '<select><option>Filed awaiting decision</option><option selected>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option>Check cashed</option><option>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
        case "Approved awaiting check":
            trHTML = '<select><option>Filed awaiting decision</option><option>Need additional documents</option><option selected>Approved awaiting check</option>' +
                '<option>Check cashed</option><option>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
        case "Check cashed":
            trHTML = '<select><option>Filed awaiting decision</option><option>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option selected>Check cashed</option><option>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
        case "Denied":
            trHTML = '<select><option>Filed awaiting decision</option><option>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option>Check cashed</option><option selected>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
        case "Appealed awaiting decision":
            trHTML = '<select><option>Filed awaiting decision</option><option>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option>Check cashed</option><option>Denied</option><option selected>Appealed awaiting decision</option></select>'
            break;
        default:
            trHTML = '<select><option>Filed awaiting decision</option><option>Need additional documents</option><option>Approved awaiting check</option>' +
                '<option>Check cashed</option><option>Denied</option><option>Appealed awaiting decision</option></select>'
            break;
    }
    return trHTML;
}

function formatInsuranceClaimCustomerResStatus(customerResolutionStatus) {
    var trHTML = '';
    switch (customerResolutionStatus) {
        case "Awaiting Insurance Check":
            trHTML = '<select><option selected>Awaiting Insurance Check</option><option>Refunded</option><option>Replacement Sent</option></select>';
            break;
        case "Refunded":
            trHTML = '<select><option>Awaiting Insurance Check</option><option selected>Refunded</option><option>Replacement Sent</option></select>';
            break;
        case "Replacement Sent":
            trHTML = '<select><option>Awaiting Insurance Check</option><option>Refunded</option><option selected>Replacement Sent</option></select>';
            break;
        default:
            trHTML = '<select><option>Awaiting Insurance Check</option><option>Refunded</option><option>Replacement Sent</option></select>';
            break;
    }
    return trHTML;
}

function formatInsuranceClaimCustomerPref(customerPreference) {
    var trHTML = '';
    switch(customerPreference){
        case "Replacement":
            trHTML = '<select><option selected>Replacement</option><option>Refund</option><option>Not Specified</option></select>';
            break;
        case "Refund":
            trHTML = '<select><option>Replacement</option><option selected>Refund</option><option>Not Specified</option></select>';
            break;
        case "Not Specified":
            trHTML = '<select><option>Replacement</option><option>Refund</option><option selected>Not Specified</option></select>';
            break;
        default:
            trHTML = '<select><option>Replacement</option><option>Refund</option><option>Not Specified</option></select>';
            break;
    }
    return trHTML;
}

// Delayed Packages
function createDelayedPackageObject(IdShippingDelayedPackages, PackageName, LastScanDate, CurrentLoc, ServiceReqNum, LastCustomerContactDate, Note) {
    var delayedPackage = {
        idshippingdelayedpackages: Number(IdShippingDelayedPackages),
        packageName: PackageName,
        lastScanDate: new Date(LastScanDate),
        currentLoc: CurrentLoc,
        serviceReqNum: ServiceReqNum,
        lastCustomerContactDate: new Date(LastCustomerContactDate),
        note: Note
    };
    return delayedPackage;
}

function delayedPackageHTMLTableData(data) {
    var lastCustomerContactDate = null;
    var lastScanDate = null;
    // FIXME NULL Check all variables 
    if (data.lastScanDate != null) {
        lastScanDate = formatDateString(data.lastScanDate);
    }
    if (data.lastCustomerContactDate != null) {
        lastCustomerContactDate = formatDateString(data.lastCustomerContactDate);
    }
    var trHTML = '<tr><td hidden>' + data.idshippingdelayedpackages + '</td><td contenteditable="true">' + data.packageName + '</td><td>' + data.ebayOrderNum + '</td><td>' +
        data.carrier + '</td><td>' + data.insuranceVal + '</td><td>' + data.trackingId + '</td><td contenteditable="true">' + '<input type="date" value="' + lastScanDate + '"/></td><td contenteditable="true">' + data.currentLoc + '</td><td>' + data.destination +
        '</td><td contenteditable="true">' + data.serviceReqNum + '</td><td contenteditable="true">' + '<input type="date" value="' + lastCustomerContactDate + '"/></td><td contenteditable="true">' + data.note + '</td><td>';
    return trHTML;
}

/* End - Helper Functions */

// Returns
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
            var trHTML = returnHtmlTableData(data) + '<input type="checkbox" name="checkBoxesReturns' + checkBoxesReturns + '"/></td></tr>';
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
            trHTML += returnHtmlTableData(data) + '<input type="checkbox" name="checkBoxesReturns' + count + '"/></td></tr>';
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
                e.parentNode.parentNode.remove();
                checkBoxesReturns--;
            });
        }
    });
});

$('#updateReturn').on('click', function () {
    var updatedReturnsData = [];
    var returns = [];
    var selector = '#returnTable tr input:checked';
    $.each($(selector), function (i, ret) {
        var toUpdateReturn = $(this).parent().siblings();
        // parameters (IdReturns, ReturnName, ReturnDate, EstimatedRefundTime, DeliveryDate)
        updatedReturnsData.push(createReturnObject(toUpdateReturn[0].innerHTML, toUpdateReturn[1].innerHTML, toUpdateReturn[6].innerHTML, toUpdateReturn[9].innerHTML,
            toUpdateReturn[7].innerHTML));
    });
    returns = { Returns: updatedReturnsData };
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/UpdateReturn',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(returns.Returns),
        success: function (data) {
            $.each($(selector), function (i, checkbox) {
                if (checkbox.checked) {
                    checkbox.checked = false;
                }
            });
        }
    });
});

// Insurance Claims
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
            var trHTML = InsuranceClaimHTMLData(data) + '<input type="checkbox" name="checkBoxesClaims' + checkBoxesClaims + '"/></td></tr>';
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
            trHTML += InsuranceClaimHTMLData(data) + '<input type="checkbox" name="checkBoxesClaims' + count + '"/></td></tr>';
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
                e.parentNode.parentNode.remove();
                checkBoxesClaims--;
            });
        }
    });
});

$('#updateInsuranceClaim').on('click', function () {
    var updatedInsuranceClaimData = [];
    var insuranceClaims = [];
    var selector = '#insuranceClaims tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateInsuranceClaimData = $(this).parent().siblings();
        // Parameters (IDInsuranceClaims, ItemName, InsuredFor, ClaimStatus, CustomerPreference, CustomerResolutionStatus, Notes, ReplacementTrackingNum) 
        updatedInsuranceClaimData.push(createInsuranceClaimObject(toUpdateInsuranceClaimData[0].innerHTML, toUpdateInsuranceClaimData[1].innerHTML, toUpdateInsuranceClaimData[4].innerHTML, toUpdateInsuranceClaimData[9].innerHTML, toUpdateInsuranceClaimData[11].innerHTML,
            toUpdateInsuranceClaimData[12].innerHTML, toUpdateInsuranceClaimData[14].innerHTML, toUpdateInsuranceClaimData[13].innerHTML));
    });
    insuranceClaims = { InsuranceClaims: updatedInsuranceClaimData };
    $.ajax({
        url: serviceUrl + 'ResolutionCenter/UpdateInsuranceClaim',
        method: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(insuranceClaims.InsuranceClaims),
        success: function (data) {
            if (data) {
                $.each($(selector), function (i, checkbox) {
                    if (checkbox.checked) {
                        checkbox.checked = false;
                    }
                });
            }
        }
    });
});

// Delayed Packages
$('#addDelayedPackage').on('click', function () {
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
            var trHTML = delayedPackageHTMLTableData(data) + '<input type="checkbox" name="checkBoxesDelays' + checkBoxesDelays + '"/></td></tr>';
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
            trHTML += delayedPackageHTMLTableData(data) + '<input type="checkbox" name="checkBoxesDelays' + count + '"/></td></tr>';
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
                e.parentNode.parentNode.remove();
                checkBoxesDelays--;
            });
        }
    });
});

$('#updateDelayedPackage').on('click', function () {
    var updatedDelayedPackageData = [];
    var delayedPackages = [];
    var selector = '#delayedPackages tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateDelayedPackage = $(this).parent().siblings();
        // Parameters (IdShippingDelayedPackages, PackageName, LastScanDate, CurrentLoc, ServiceReqNum, LastCustomerContactDate,Note) 
        updatedDelayedPackageData.push(createDelayedPackageObject(toUpdateDelayedPackage[0].innerHTML, toUpdateDelayedPackage[1].innerHTML, toUpdateDelayedPackage[6].innerHTML, toUpdateDelayedPackage[7].innerHTML,
            toUpdateDelayedPackage[9].innerHTML, toUpdateDelayedPackage[10].innerHTML, toUpdateDelayedPackage[11].innerHTML));
        delayedPackages = { ShippingDelayedPackages: updatedDelayedPackageData };
        $.ajax({
            url: serviceUrl + 'ResolutionCenter/UpdateDelayedPackage',
            method: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(delayedPackages.ShippingDelayedPackages),
            success: function (data) {
                if (data) {
                    $.each($(selector), function (i, checkbox) {
                        if (checkbox.checked) {
                            checkbox.checked = false;
                        }
                    });
                }
            }
        });
    });
});
// ---------------------------- Profit Dashboard Controller -------------------------------------------------------------------------- //

/* Helper Functions */

/* End - Helper Functions */
// ---------------------------- Adorama Listings Controller -------------------------------------------------------------------------- //

/* Helper Functions */

/* End - Helper Functions */

// Get All Adorama Listings
$.ajax({
    url: serviceUrl + 'AdoramaListings/AdoramaListings',
    method: 'GET',
    success: function (data) {
        var jamoTrHTML = '';
        var klipschTrHTML = '';
        var miscTrHTML = '';
        var inactiveTrHTML = '';
        jamoCount = 1;
        klipschCount = 1;
        $.each(data, function (i, item) {
            if (item.active == 1) {
                switch (item.manufacture) {
                    case "Jamo":
                        jamoTrHTML += '<tr><td hidden>' + item.idadoramalistings + '</td><td>' + item.listingName + '</td><td>' + item.specialPrice + '</td><td><a href="' + item.url + '">click me</a></td><td>'
                            + '<input type="checkbox" name="jamoCheckBox' + jamoCount + '"/></td></tr>';
                        jamoCount++;
                        break;
                    case "Klipsch":
                        klipschTrHTML += '<tr><td hidden>' + item.idadoramalistings + '</td><td>' + item.listingName + '</td><td>' + item.specialPrice + '</td><td><a href="' + item.url + '">click me</a></td><td>'
                            + '<input type="checkbox" name="klipschCheckBox' + klipschCount + '"/></td></tr>';
                        klipschCount++;
                        break;
                    case "Misc":
                        miscTrHTML += '<tr><td hidden>' + item.idadoramalistings + '</td><td>' + item.listingName + '</td><td>' + item.specialPrice + '</td><td><a href="' + item.url + '">click me</a></td><td>'
                            + '<input type="checkbox"/></td></tr>';
                        break;
                    default:
                        break;
                }
            }
            else {
                inactiveTrHTML += '<tr><td hidden>' + item.idadoramalistings + '</td><td>' + item.listingName + '</td><td>' + item.specialPrice + '</td><td><a href="' + item.url + '">click me</a></td><td>'
                    + '<input type="checkbox"/></td></tr>';
            }
        });
        jamoCheckBox = jamoCount;
        klipschCheckBox = klipschCount;
        $('#jamoListingTable').append(jamoTrHTML);
        $('#klipschListingTable').append(klipschTrHTML);
        $('#miscListingTable').append(miscTrHTML);
        $('#inactiveListingTable').append(inactiveTrHTML);
    }
});

// Jamo Table
$('#addJamoListing').on('click', function () {
    var adoramaListing = {
        listingName: $('#jamoListingName').val(),
        specialPrice: parseFloat($('#jamoSpecialPrice').val()),
        url: $('#jamoUrl').val(),
        manufacture: "Jamo",
        active: 1
    };
    $.ajax({
        url: serviceUrl + 'AdoramaListings/AddJamoListing',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(adoramaListing),
        success: function (data) {
            /* Clear all the form data */
            $('#jamoListingName').val('');
            $('#jamoSpecialPrice').val('');
            $('#jamoUrl').val('');

            /* Append the new data to the table*/
            var trHTML = '<tr><td hidden>' + data.idadoramalistings + '</td><td>' + data.listingName + '</td><td> <a href="' + data.specialPrice + '">click me</a></td><td>' + data.url + '</td><td>'
                + '<input type="checkbox" name="jamoCheckBox' + jamoCheckBox + '"/></td></tr>';
            $('#jamoListingTable').append(trHTML);
            jamoCheckBox++;
        }
    });
});

$('#deleteJamoListing').on('click', function () {
    var jamoListingIds = [];
    var selector = '#jamoListingTable tr input:checked';
    $.each($(selector), function (i, listing) {
        var jamoListingId = $(this).parent().siblings(":first").text();
        jamoListingIds.push(jamoListingId);
    });
    var idList = { ids: jamoListingIds.toString() };

    $.ajax({
        url: serviceUrl + 'AdoramaListings/DeleteJamoListing',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#jamoListingTable input:checked').forEach(e => {
                e.parentNode.parentNode.remove();
                jamoCheckBox--;
            });
        }
    });
});

// Klipsch Table
$('#addKlipschListing').on('click', function () {
    var klipschListing = {
        listingName: $('#klipschListingName').val(),
        specialPrice: parseFloat($('#klipschSpecialPrice').val()),
        url: $('#klipschUrl').val(),
        manufacture: 'Klipsch',
        active: 1
    };
    $.ajax({
        url: serviceUrl + 'AdoramaListings/AddKlipschListing',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(klipschListing),
        success: function (data) {
            /* clear the input data forms */
            $('#klipschListingName').val('');
            $('#klipschSpecialPrice').val('');
            $('#klipschUrl').val('');

            /* display the newly added data to the table */
            var trHTML = '<tr><td hidden>' + data.idadoramalistings + '</td><td>' + data.listingName + '</td><td>' + data.specialPrice + '</td><td><a href="' + data.url + '">click me</a></td><td>' + '<input type="checkbox" name="klipschCheckBox' + klipschCheckBox + '"/></td></tr>';
            $('#klipschListingTable').append(trHTML);
            klipschCheckBox++;
        }
    });
});

$('#deleteKlipschListing').on('click', function () {
    var klipschIds = [];
    var selector = '#klipschListingTable tr input:checked';
    $.each($(selector), function (i, item) {
        var klipschId = $(this).parent().siblings(":first").text();
        klipschIds.push(klipschId);
    });
    var idList = { ids: klipschIds.toString() };
    $.ajax({
        url: serviceUrl + 'AdoramaListings/DeleteKlipschListing',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(idList),
        success: function (data) {
            if (data) {
                document.querySelectorAll('#klipschListingTable tr input:checked').forEach(x => {
                    x.parentNode.parentNode.remove();
                    klipschCheckBox--;
                });
            }
        }
    });
});

// Misc Table
$('#addMiscListing').on('click', function () {
    var miscListing = {
        listingName: $('#miscListingName').val(),
        specialPrice: parseFloat($('#miscSpecialPrice').val()),
        url: $('#miscUrl').val(),
        manufacture: "Misc",
        active: 1
    }
    $.ajax({
        url: serviceUrl + 'AdoramaListings/AddMiscListing',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(miscListing),
        success: function (data) {
            $('#miscListingName').val('');
            $('#miscSpecialPrice').val('');
            $('#miscUrl').val('');
            var trHTML = '<tr><td hidden>' + data.idadoramalistings + '</td><td>' + data.listingName + '</td><td>' + data.specialPrice + '</td><td><a href="' + data.url + '">click me</a></td><td><input type="checkbox"/></td></tr>';
            $('#miscListingTable').append(trHTML);
        }
    });
})

$('#deleteMiscListing').on('click', function () {
    var miscIds = [];
    var selector = '#miscListingTable tr input:checked';
    $.each($(selector), function (i, item) {
        var miscId = $(this).parent().siblings(":first").text();
        miscIds.push(miscId);
    });
    var idList = { ids: miscIds.toString() };
    $.ajax({
        url: serviceUrl + 'AdoramaListings/DeleteMiscListing',
        method: 'DELETE',
        contentType: 'application/json',
        data: JSON.stringify(idList),
        success: function (data) {
            document.querySelectorAll('#miscListingTable tr input:checked').forEach(x => {
                x.parentNode.parentNode.remove();
            })
        }
    });
});

// Inactive Table
$('#makeListingActive').on('click', function () {
    var adoramaListingIds = [];
    var selector = '#inactiveListingTable tr input:checked';
    $.each($(selector), function (i, item) {
        var adoramaListingId = $(this).parent().siblings(":first").text();
        adoramaListingIds.push(adoramaListingId);
    });
    var idList = { ids: adoramaListingIds.toString() };
    $.ajax({
        url: serviceUrl + 'AdoramaListings/ActivateAdoramaListing',
        method: 'PUT',
        contentType:'application/json',
        data: JSON.stringify(idList),
        success: function (adoramaListings) {
            if (adoramaListings != null) {
                $.each(adoramaListings, function (i, data) {
                var trHTML = '<tr><td hidden>' + data.idadoramalistings + '</td><td>' + data.listingName + '</td><td>' + data.specialPrice + '</td><td><a href="' + data.url + '">click me</a></td><td>' + '<input type="checkbox"/></td></tr>';
                switch (data.manufacture) {
                    case "Jamo":
                        $('#jamoListingTable').append(trHTML);
                        break;
                    case "Klipsch":
                        $('#klipschListingTable').append(trHTML);
                        break;
                    case "Misc":
                        $('#miscListingTable').append(trHTML);
                        break;
                    default:
                        // throw an error
                        break; 
                    }
                });
                /* remove the activated listings from the inactive table */
                document.querySelectorAll('#inactiveListingTable tr input:checked').forEach(x => { x.parentNode.parentNode.remove() });
            }
        }
    });
});

