var serviceUrl = 'https://localhost:44388/';
var checkBoxes = 0;
var checkBoxesCur = 0;
var checkBoxesTop = 0; 
var checkBoxesReturns = 0;
var checkBoxesClaims = 0;
var checkBoxesDelays = 0;

function inventoryHtmlTableData(item) {
    var trHTML = '<tr><td hidden>' + item.idInventory + '</td><td contenteditable="true">' + item.name + '</td><td contenteditable="true">' + item.qty + '</td><td>' + item.pricePerPiece + '</td><td contenteditable="true">' + item.totalPrice + '</td><td>' + item.discountType + '</td><td contenteditable="true">' + item.discount
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

function createInventoryObject(IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, DiscountStatus, Vendor, DatePurchased, Payment, ReturnBy, Warranty, Classification,EstimatedDelivery, TrackingNumber, CurrentInventory) {
    var Inventory = {
        // FIXME - correct formating for dates
        idInventory: Number(IdInventory),
        name: Name,
        qty: parseFloat(Qty),
        pricePerPiece: parseFloat(PricePerPiece),
        totalPrice: parseFloat(TotalPrice),
        discountType: DiscountType,
        discount: parseFloat(Discount),
        discountStatus: DiscountStatus,
        vendor: Vendor,
        //datePurchased: null,
        payment: Payment,
        //returnBy: null,
        warranty: Warranty,
        classification: Classification,
        trackingNumber: TrackingNumber,
        estimatedDelivery: new Date(EstimatedDelivery),
        ebayItemId: null,
        currentInventory: Number(CurrentInventory)
    };
    return Inventory;
}

function createReturnObject(IdReturns, ReturnName, ReturnDate, EstimatedRefundTime, DeliveryDate) {
    var Returns = {
        idReturns: Number(IdReturns),
        returnName:ReturnName,
        returnDate: new Date(ReturnDate),
        estimatedRefundTime: EstimatedRefundTime,
        deliveryDate: new Date(DeliveryDate)
    };
    return Returns;
}

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

function stringParser(discountStatus) {
    var discountStatSplit = discountStatus.split('selected');
    var discountStatSplit2 = discountStatSplit[1].split('<');
    var discountStatVal = discountStatSplit2[0].split('>');
    return discountStatVal[1];
}

$('#updatecurrinv').on('click', function () {
    var updatedCurrentInvData = [];
    var curInventory = [];
    var selector = '#currentinvTable tr input:checked';
    $.each($(selector), function (i, item) {
        var toUpdateCurrentInv = $(this).parent().siblings();
        // Parameters (IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, DiscountStatus, Vendor, DatePurchased - not editable, Payment, ReturnBy, Warranty, Classification, EstimatedDelivery - null dne, TrackingNumber - null dne, CurrentInventory) 
       updatedCurrentInvData.push(createInventoryObject(toUpdateCurrentInv[0].innerHTML, toUpdateCurrentInv[1].innerHTML, toUpdateCurrentInv[2].innerHTML, toUpdateCurrentInv[3].innerHTML, toUpdateCurrentInv[4].innerHTML, toUpdateCurrentInv[5].innerHTML,
           toUpdateCurrentInv[6].innerHTML, toUpdateCurrentInv[7].children[0].value, toUpdateCurrentInv[8].innerHTML, toUpdateCurrentInv[9].innerHTML, toUpdateCurrentInv[10].innerHTML,
           toUpdateCurrentInv[11].innerHTML, toUpdateCurrentInv[12].innerHTML, toUpdateCurrentInv[13].innerHTML, null, null, 1));
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
    inputData += '&discountType=' + $('#discountType').val() + '&discountStatus='+ $('#discountStatus').val() +'&payment=' + $('#payment').val() + '&classification=' + $('#classification').val();
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

         //Parameters (IdInventory, Name, Qty, PricePerPiece, TotalPrice, DiscountType, Discount, DiscountStatus, Vendor, DatePurchased - null bc not editable, Payment, ReturnBy - null dne for incoming inv, Warranty, Classification, EstimatedDelivery, TrackingNumber, CurrentInventory) 
        updatedIncomingInvData.push(createInventoryObject(toUpdateIncomingInv[0].innerHTML, toUpdateIncomingInv[1].innerHTML, toUpdateIncomingInv[2].innerHTML, toUpdateIncomingInv[3].innerHTML, toUpdateIncomingInv[4].innerHTML, toUpdateIncomingInv[5].innerHTML,
            toUpdateIncomingInv[6].innerHTML, toUpdateIncomingInv[7].innerHTML, toUpdateIncomingInv[8].innerHTML, null, toUpdateIncomingInv[10].innerHTML, null,
            toUpdateIncomingInv[11].innerHTML, toUpdateIncomingInv[12].innerHTML, toUpdateIncomingInv[13].innerHTML, toUpdateIncomingInv[14].innerHTML, 0))
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
function returnHtmlTableData(data) {
    var trHTML = '<tr><td hidden>' + data.idreturns + '</td><td contenteditable="true">' + data.returnName + '</td><td>' + data.quantity + '</td><td>' + data.totalPrice +
        '</td><td>' + data.paymentMethod + '</td><td>' + data.returnVendor + '</td><td contenteditable="true">' + data.returnDate + '</td><td contenteditable="true">' + data.deliveryDate +
        '</td><td>' + data.trackingNum + '</td><td contenteditable="true">' + data.estimatedRefundTime + '</td><td>';
    return trHTML;
}

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
            var trHTML = returnHtmlTableData(data) +'<input type="checkbox" name="checkBoxesReturns' + checkBoxesReturns +'"</td></tr>';
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
            trHTML += returnHtmlTableData(data) + '<input type="checkbox" name="checkBoxesReturns' + count + '"</td></tr>';
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

// Resolution center - insurance claims
function InsuranceClaimHTMLData(data) {
    var trHTML = '<tr><td hidden>' + data.idinsuranceclaims + '</td><td contenteditable="true">' + data.itemName + '</td><td>' + data.ebayOrderNumber + '</td><td>' +
        data.sellPrice + '</td><td contenteditable="true">' + data.insuredFor + '</td><td>' + data.shippingCarrier + '</td><td>' + data.shippingCost + '</td><td>' + data.tracking + '</td><td>' + data.claimNumber +
        '</td><td contenteditable="true">' + data.claimStatus + '</td><td>' + data.claimFileDate + '</td><td contenteditable="true">' + data.customerPreference + '</td><td contenteditable="true">' +
        data.customerResolutionStatus + '</td><td contenteditable="true">' + data.replacementTrackingNum + '</td><td contenteditable="true">' + data.notes + '</td><td>';
    return trHTML;
}

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
            var trHTML = InsuranceClaimHTMLData(data) + '<input type="checkbox" name="checkBoxesClaims' + checkBoxesClaims + '"</td></tr>';
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
            trHTML += InsuranceClaimHTMLData(data) + '<input type="checkbox" name="checkBoxesClaims' + checkBoxesClaims + '"</td></tr>';
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
        success: function(data) {
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

// Resolution center - Delayed packages
function createDelayedPackageObject(IdShippingDelayedPackages, PackageName, LastScanDate, CurrentLoc, ServiceReqNum, LastCustomerContactDate,Note) {
    var delayedPackage = {
        idshippingdelayedpackages : Number(IdShippingDelayedPackages),
        packageName : PackageName,
        lastScanDate : new Date(LastScanDate),
        currentLoc : CurrentLoc, 
        serviceReqNum : ServiceReqNum, 
        lastCustomerContactDate : new Date(LastCustomerContactDate), 
        note : Note
    };
    return delayedPackage;
}

function delayedPackageHTMLTableData(data) {
    var trHTML = '<tr><td hidden>' + data.idshippingdelayedpackages + '</td><td contenteditable="true">' + data.packageName + '</td><td>' + data.ebayOrderNum + '</td><td>' +
        data.carrier + '</td><td>' + data.insuranceVal + '</td><td>' + data.trackingId + '</td><td contenteditable="true">' + data.lastScanDate + '</td><td contenteditable="true">' + data.currentLoc + '</td><td>' + data.destination +
        '</td><td contenteditable="true">' + data.serviceReqNum + '</td><td contenteditable="true">' + data.lastCustomerContactDate + '</td><td contenteditable="true">' + data.note + '</td><td>';
    return trHTML;
}

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
            var trHTML = delayedPackageHTMLTableData(data) + '<input type="checkbox" name="checkBoxesDelays' + checkBoxesDelays + '"</td></tr>';
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
            trHTML += delayedPackageHTMLTableData(data) + '<input type="checkbox" name="checkBoxesDelays' + checkBoxesDelays + '"</td></tr>';
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