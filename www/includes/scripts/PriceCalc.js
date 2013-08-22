function onInputKeyup() {

    $(this).val(formatInputToNumber($(this).val()));

}

function onDealerInputBlur() {

    //alert(this.id);
    saveDealer();
    setDealerData($("#inputDealerSelection").val())

}
function onDealerNameBlur() {


    saveDealer();
    setDealerData($("#inputDealerSelection").val())

}

function onDealerInputFocus() {
    $("#panelKeypad").panel("open")
}

function replaceAll(find, replace, str) {
    while (str.indexOf(find) >= 0) {
        str = str.replace(find, replace);
    }
    return str;
}

function formatInputToNumber(testnumber) {

    return testnumber;
    var formattednumber = "";
    var testlength = 0;
    if (testnumber == null) {
        return "";
    }
    if (testnumber == undefined) {
        return "";
    }


    if (testlength.length < 1) {
        return "";
    }


    testnumber = replaceAll(".", "", testnumber);
    testnumber = replaceAll(",", "", testnumber);

    testlength = testnumber.length;


    testlength = testnumber.length;

    if (testlength > 2) {
        formattednumber = testnumber.substr(0, testlength - 2);
        formattednumber = formattednumber + "." + testnumber.substr(testlength - 2, 2);
    }
    else {
        //if (testnumber.length < 2) {
        //    return "0.0".concat(testnumber);
        //}

        //return "0.".concat(testnumber);

        return ".".concat(testnumber);
    }

    if (testnumber.length > 5) {

        testlength = formattednumber.length;
        part1 = testnumber.substr(0, testlength - 6);
        part2 = testnumber.substr(testlength - 6, 3);
        part3 = testnumber.substr(testlength - 3, 2);
        formattednumber = part1 + "," + part2 + "." + part3;

    }

    return formattednumber;
}


function setRetailData(dealerName) {
    //get items from storage
    var RetailPriceCalcs = $.makeArray($.RetailPriceCalc);
    var data = localStorage['mohawkRetail']

    var retailYd = 0;
    var retailYdWithMarkup = 0;
    var retailFt = 0;
    var wholesaleYd = 0;


    var dealerObject = getDealerObject(dealerName);
    if (dealerObject == null) {
        $("#tbodyRetail").empty();
        return;
    }

    $("#headerRetailDealerName").text(dealerObject.name);


    if (data == undefined || data == null || data == "") {
        $("#tbodyRetail").empty();
        addBlankRetailRow(dealerObject.isRetailYd);
        return;
    }

    RetailPriceCalcs = JSON.parse(data);

    //get matching items
    var filteredDealer = $.grep(RetailPriceCalcs, function (item) {
        if (item != null) {
            return item.dealerName == dealerName;
        }
        return 0;
    });

    //update UI with data
    if (filteredDealer.length < 1) {
        $("#tbodyRetail").empty();
        addBlankRetailRow(dealerObject.isRetailYd);
        return;
    }




    filteredDealer.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.itemId == '') {
            return true;
        }

        if (obj2.itemId == '') {
            return false;
        }

        return obj1.itemId > obj2.itemId;
    });


    $("#tbodyRetail").empty();
    var intemnumber = 0;
    $.each(filteredDealer, function (index, retailPriceCalc) {
        var retailYd = 0;
        var retailYdWithMarkup = 0;
        var retailFt = 0;
        var wholesaleYd = 0;

        if (retailPriceCalc != null) {
            //calculate total here
            wholesaleYd = parseFloat(retailPriceCalc.wholesaleYd);
            if (dealerObject.carpetonly == 'false') {
                if (dealerObject.usecushion == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.cushion);
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.cushion);
                }


                if (dealerObject.useinstallation == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.installation)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.installation);
                }

                if (dealerObject.usefreight == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.freight)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.freight);
                }


                if (dealerObject.useother == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.other)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.other);
                }
            }

            var total = 0;
            var multiplier = 0;
            var ydWithMarkup = retailYdWithMarkup;
            var ydWholesale = wholesaleYd;

            if (dealerObject.useprofit == "false") {

                multiplier = parseInt(dealerObject.profit) / 100 + 1;
                total = ((((ydWholesale - retailYd) / multiplier)) - ydWithMarkup).toFixed(2);
            }
            else {

                multiplier = parseFloat((1 - (parseFloat(dealerObject.markup) / 100)).toFixed(2));
                total = (((ydWholesale - retailYd) * multiplier) - ydWithMarkup).toFixed(2);
            }

            retailYd = total;

            retailFt = (retailYd / 9).toFixed(2);

            if (retailPriceCalc.wholesaleYd > 0) {
                var yardby9 = (retailPriceCalc.wholesaleYd / 9).toFixed(2);
            }
            else {
                yardby9 = 0;
            }


            addRetailRow(retailPriceCalc.productName, retailPriceCalc.wholesaleYd, yardby9, retailYd, retailFt, false, true, retailPriceCalc.itemId, dealerObject.isRetailYd);
        }


    });
    //add a blank row
    //addBlankRetailRow(dealerObject.isRetailYd);
    //$("#tableRetail").table("refresh");
}



function setWholesaleData(dealerName) {
    //get items from storage
    var WholesalePriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkWholesale']

    var retailYd = 0;
    var retailYdWithMarkup = 0;
    var retailFt = 0;
    var wholesaleYd = 0;
    var headerDetails = '';

    var dealerObject = getDealerObject(dealerName);
    if (dealerObject == null) {
        $("#tbodyWholesale").empty();
        return;
    }

    $("#headerWholesaleDealerName").text(dealerObject.name);



    if (data == undefined || data == null || data == "") {
        $("#tbodyWholesale").empty();
        addBlankRow();
        return;
    }

    WholesalePriceCalcs = JSON.parse(data);

    //get matching items
    var filteredDealer = $.grep(WholesalePriceCalcs, function (item) {
        if (item != null) {
            return item.dealerName == dealerName;
        }
        return 0;
    });

    //update UI with data
    if (filteredDealer.length < 1) {
        $("#tbodyWholesale").empty();
        addBlankRow();
        return;
    }


    filteredDealer.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.itemId == '') {
            return true;
        }

        if (obj2.itemId == '') {
            return false;
        }

        return obj1.itemId > obj2.itemId;
    });


    $("#tbodyWholesale").empty();
    var intemnumber = 0;
    $.each(filteredDealer, function (index, wholesalePriceCalc) {
        var retailYd = 0;
        var retailYdWithMarkup = 0;
        var retailFt = 0;
        var wholesaleYd = 0;

        if (wholesalePriceCalc != null) {
            //calculate total here
            wholesaleYd = parseFloat(wholesalePriceCalc.wholesaleYd).toFixed(2);
            if (dealerObject.carpetonly == 'false') {
                if (dealerObject.usecushion == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.cushion);
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.cushion);
                }


                if (dealerObject.useinstallation == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.installation)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.installation);
                }

                if (dealerObject.usefreight == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.freight)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.freight);
                }


                if (dealerObject.useother == "true") {
                    //do it
                    retailYdWithMarkup = retailYdWithMarkup + parseFloat(dealerObject.other)
                }
                else {
                    retailYd = parseFloat(retailYd) + parseFloat(dealerObject.other);
                }
            }

            var total = 0;
            var multiplier = 0;
            var ydWithMarkup = retailYdWithMarkup;
            var ydWholesale = parseFloat(wholesaleYd);
            if (dealerObject.useprofit == "false") {

                multiplier = parseInt(dealerObject.profit) / 100 + 1;
                total = ((multiplier * (ydWithMarkup + ydWholesale)) + retailYd).toFixed(2);
            }
            else {


                multiplier = parseFloat((1 - (parseFloat(dealerObject.markup) / 100)).toFixed(2));
                total = (((ydWithMarkup + ydWholesale) / multiplier) + retailYd).toFixed(2);
            }


            retailYd = total;

            retailFt = (retailYd / 9).toFixed(2);
            addRow(wholesalePriceCalc.productName, ydWholesale, retailYd, retailFt, false, true, wholesalePriceCalc.itemId);
        }

    });
    //add a blank row
    // addBlankRow();
    //$("#tableWholesale").table("refresh");

}

function saveWholesale(itemId, dealerName, productName, wholesaleYd) {
    deleteWholesale(dealerName, itemId);

    addWholesale(itemId, dealerName, productName, wholesaleYd);

}

function saveRetail(itemId, dealerName, productName, retailYd, retailFt) {
    deleteRetail(dealerName, itemId);

    addRetail(itemId, dealerName, productName, retailYd, retailFt);

}

function deleteWholesale(dealerName, itemId) {
    //get items from storage
    var WholesalePriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkWholesale'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        WholesalePriceCalcs = JSON.parse(data);

        //get matching items
        var filteredDealer = $.grep(WholesalePriceCalcs, function (item) {
            if (item != null) {
                return item.itemId != itemId;
            }
            return 0;
        });


        if (filteredDealer.length > 0) {
            filteredDealer.sort(function (obj1, obj2) {
                if (obj1 == null) {
                    return true;
                }
                if (obj2 == null) {
                    return false;
                }

                if (obj1.productname == '') {
                    return true;
                }

                if (obj2.productname == '') {
                    return false;
                }

                return obj1.productName > obj2.productName;
            });
        }

        //save to storage
        localStorage['mohawkWholesale'] = JSON.stringify(filteredDealer);
    }
}


function renameWholesaleByDealerName(dealerName, newDealerName) {
    //get items from storage
    var WholesalePriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkWholesale'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        WholesalePriceCalcs = JSON.parse(data);

        //get matching items
        var targetDealer = $.grep(WholesalePriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName == dealerName;
            }
            return 0;
        });

        //update UI with data
        if (targetDealer.length < 1) {
            //abandon
            return;
        }


        //get the rest
        var filteredDealer = $.grep(WholesalePriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName != dealerName;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length < 1) {
            //abandon
            //return;
        }

        $.each(targetDealer, function (i,item) {
            
            item.dealerName = newDealerName;
            filteredDealer.push(item);
        });




        filteredDealer.sort(function (obj1, obj2) {
            if (obj1 == null) {
                return true;
            }
            if (obj2 == null) {
                return false;
            }

            if (obj1.productname == '') {
                return true;
            }

            if (obj2.productname == '') {
                return false;
            }

            return obj1.productName > obj2.productName;
        });


        //save to storage
        localStorage['mohawkWholesale'] = JSON.stringify(filteredDealer);
    }
}

function renameRetailByDealerName(dealerName, newDealerName) {
    //get items from storage
    var RetailPriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkRetail'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        RetailPriceCalcs = JSON.parse(data);

        //get matching items
        var targetDealer = $.grep(RetailPriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName == dealerName;
            }
            return 0;
        });

        //update UI with data
        if (targetDealer.length < 1) {
            //abandon
            return;
        }


        //get the rest
        var filteredDealer = $.grep(RetailPriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName != dealerName;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length < 1) {
            //abandon
            //return;
        }

        $.each(targetDealer, function (i, item) {

            item.dealerName = newDealerName;
            filteredDealer.push(item);
        });




        filteredDealer.sort(function (obj1, obj2) {
            if (obj1 == null) {
                return true;
            }
            if (obj2 == null) {
                return false;
            }

            if (obj1.productname == '') {
                return true;
            }

            if (obj2.productname == '') {
                return false;
            }

            return obj1.productName > obj2.productName;
        });


        //save to storage
        localStorage['mohawkRetail'] = JSON.stringify(filteredDealer);
    }
}







function deleteWholesaleByDealerName(dealerName) {
    //get items from storage
    var WholesalePriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkWholesale'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        WholesalePriceCalcs = JSON.parse(data);

        //get matching items
        var filteredDealer = $.grep(WholesalePriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName != dealerName;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length < 1) {
            //abandon
            return;
        }



        filteredDealer.sort(function (obj1, obj2) {
            if (obj1 == null) {
                return true;
            }
            if (obj2 == null) {
                return false;
            }

            if (obj1.productname == '') {
                return true;
            }

            if (obj2.productname == '') {
                return false;
            }

            return obj1.productName > obj2.productName;
        });


        //save to storage
        localStorage['mohawkWholesale'] = JSON.stringify(filteredDealer);
    }
}


function deleteRetail(dealerName, itemId) {
    //get items from storage
    var RetailPriceCalcs = $.makeArray($.RetailPriceCalc);
    // remove all data 
    //localStorage['mohawkRetail2'] = JSON.stringify("");
    var data = localStorage['mohawkRetail'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        RetailPriceCalcs = JSON.parse(data);

        //get matching items
        var filteredDealer = $.grep(RetailPriceCalcs, function (item) {
            if (item != null) {
                return item.itemId != itemId;
            }
            return 0;
        });



        if (filteredDealer.length > 0) {
            filteredDealer.sort(function (obj1, obj2) {
                if (obj1 == null) {
                    return true;
                }
                if (obj2 == null) {
                    return false;
                }

                if (obj1.productname == '') {
                    return true;
                }

                if (obj2.productname == '') {
                    return false;
                }

                return obj1.productName > obj2.productName;
            });
        }


        //save to storage
        localStorage['mohawkRetail'] = JSON.stringify(filteredDealer);
    }
}


function deleteRetailByDealerName(dealerName) {
    //get items from storage
    var RetailPriceCalcs = $.makeArray($.RetailPriceCalc);

    var data = localStorage['mohawkRetail'];
    var filteredDealer;
    if (data != undefined && data != null && data != "") {
        RetailPriceCalcs = JSON.parse(data);

        //get matching items
        var filteredDealer = $.grep(RetailPriceCalcs, function (item) {
            if (item != null) {
                return item.dealerName != dealerName;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length < 1) {
            //alert(item + " already exist");
            return;
        }



        filteredDealer.sort(function (obj1, obj2) {
            if (obj1 == null) {
                return true;
            }
            if (obj2 == null) {
                return false;
            }

            if (obj1.productname == '') {
                return true;
            }

            if (obj2.productname == '') {
                return false;
            }

            return obj1.productName > obj2.productName;
        });


        //save to storage
        localStorage['mohawkRetail'] = JSON.stringify(filteredDealer);
    }
}


function addWholesale(itemId, dealerName, productName, wholesaleYd) {
    //get items from storage
    var retailYd = 0;
    var retailYdWithMarkup = 0;
    var retailFt = 0;

    if (wholesaleYd == null) {
        wholesaleYd = "0";
    }

    var WholesalePriceCalcs = $.makeArray($.WholesalePriceCalc);
    var data = localStorage['mohawkWholesale']

    if (data != undefined && data != null && data != "") {

        WholesalePriceCalcs = JSON.parse(data);

        var maxID = 0;
        //get matching items
        var filteredDealer = $.grep(WholesalePriceCalcs, function (item) {
            if (item != null) {
                return item.itemId == itemId;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length > 0) {
            //already exist
            return;
        }


    }
    if (itemId == null || itemId == "") {
        itemId = (new Date()).getTime();
    }

    //create new item
    var myPriceCalc = new $.WholesalePriceCalc(dealerName, productName, wholesaleYd, '0', '0', itemId);
    WholesalePriceCalcs.push(myPriceCalc);


    WholesalePriceCalcs.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.productname == '') {
            return true;
        }

        if (obj2.productname == '') {
            return false;
        }

        return obj1.productName > obj2.productName;
    });

    //save to storage
    localStorage['mohawkWholesale'] = JSON.stringify(WholesalePriceCalcs);
}


function addRetail(itemId, dealerName, productName, retailYd, retailFt) {
    //get items from storage
    var retailYdWithMarkup = 0;
    var retailFt = 0;

    if (retailYd == null) {
        retailYd = "0";
    }

    var RetailPriceCalcs = $.makeArray($.RetailPriceCalc);
    var data = localStorage['mohawkRetail']

    if (data != undefined && data != null && data != "") {


        RetailPriceCalcs = JSON.parse(data);

        var maxID = 0;
        //get matching items
        var filteredDealer = $.grep(RetailPriceCalcs, function (item) {
            if (item != null) {
                return item.itemId == itemId;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length > 0) {
            //already exist
            return;
        }
    }

    if (itemId == null || itemId == "") {
        itemId = (new Date()).getTime();
    }

    //create new item
    var myPriceCalc = new $.RetailPriceCalc(dealerName, productName, retailYd, retailYd, retailFt, itemId);
    RetailPriceCalcs.push(myPriceCalc);

    RetailPriceCalcs.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.productname == '') {
            return true;
        }

        if (obj2.productname == '') {
            return false;
        }

        return obj1.productName > obj2.productName;
    });


    //save to storage
    localStorage['mohawkRetail'] = JSON.stringify(RetailPriceCalcs);
}

function onPanelDealerClick() {
    $('#panelDealer').trigger('expand');
    $('#panelRetail').trigger('collapse');
    $('#panelWholesale').trigger('collapse');
    location.href = "#panelDealer";
}

function ontopMenuSettingsClick() {
    alert("Version 1.0.4");
};

function onPanelWholesaleClick() {

    $('#panelDealer').trigger('collapse');
    $('#panelRetail').trigger('collapse');
    $('#panelWholesale').trigger('expand');
    location.href = "#panelWholesale";
}

function onPanelRetailClick() {

    $('#panelDealer').trigger('collapse');
    $('#panelRetail').trigger('expand');
    $('#panelWholesale').trigger('collapse');
    location.href = "#panelRetail";
}

function onWholesaleCostSaveButtonClick() {
    var myArray = this.id.split('_');
    var dealerName = global_selectDealerSelection;
    var productName = $("#wholesaleProduct_" + myArray[1]).val();
    var wholesaleYd = $("#wholesaleCost_" + myArray[1]).val();
    var itemId = myArray[1];
    if (dealerName == "") {
        alert("Please select a dealer");
        return;
    }
    if (wholesaleYd == "") {
        //alert("Please enter wholesale amount");
        wholesaleYd = "0.00";
        return;
    }


    saveWholesale(itemId, dealerName, productName, wholesaleYd);
    setDealerData(dealerName);

}

function onRetailCostSaveButtonClick() {
    var myArray = this.id.split('_');
    var dealerName = global_selectDealerSelection;
    var productName = $("#retailProduct_" + myArray[1]).val();
    var retailYd = $("#retailCost_" + myArray[1]).val();
    var retailFt = $("#retailCostFt_" + myArray[1]).val();
    var itemId = myArray[1];
    if (dealerName == "") {
        alert("Please select a dealer");
        return;
    }

    var test = $('[name=radioYdFt]:checked').val();

    if (global_isRetailYd == "true") {
        retailFt = (retailYd / 9).toFixed(2);
    }
    else {
        retailYd = (retailFt * 9).toFixed(2);
    }

    //if (test == "ft") {
    //    if (retailFt == "") {
    //        alert("Please enter retail amount");
    //        return;
    //    }

    //    //look at global var to see wich way to calculate
    //    retailYd = (retailFt * 9).toFixed(2);
    //}
    //else {
    //    if (retailYd == "") {
    //        alert("Please enter retail amount");
    //        return;
    //    }


    //    retailFt = (retailYd / 9).toFixed(2);
    //}

    saveRetail(itemId, dealerName, productName, retailYd, retailFt);
    setDealerData(dealerName);

}

function addBlankRow() {
    addRow('', '', '0', '0', true, false, '', true);
}

function addBlankRetailRow(RetailYd) {
    addRetailRow('', '', '', '0', '0', true, false, '', RetailYd);
}

function addRow(wholesaleProduct, wholesaleAmount, retailYd, retailFt, boolIncludeSave, boolIncludeDelete, itemId) {

    if (itemId == null || itemId == "") {
        itemId = (new Date()).getTime();

    }

    // var rowText = $("#WholesaleToRetailRow").html();

    var mytable = '';//                                 <div class="datarow spaced" id="productdata_1">';
    var mytable = ' <div class="clear" ></div>';
    mytable = mytable + '                             <div class="round_wrapper2 bgmed">';

    mytable = mytable + '                              	<div class="datacell1">';
    mytable = mytable + '                                <div class="cellpad">';
    mytable = mytable + '                                         <h6 class="mobileonly mth">Product Name</h6>';
    mytable = mytable + '                                         <div class="left_wrapper_rnd bglight">';
    mytable = mytable + '                                             <input type="text" id="wholesaleProduct_' + itemId + '" name="productname_1" class="thinput2" value="' + wholesaleProduct + '" />';
    mytable = mytable + '                                         </div>';
    mytable = mytable + ' </div>';
    mytable = mytable + '                                 </div>';
    mytable = mytable + '                                 <div class="datacell2">';
    mytable = mytable + '                                 	<div class="cellpad">';
    mytable = mytable + '                                     	<h6 class="mobileonly mth">Carpet Cost <span class="sqyd">sq. yd.</span></h6>';
    mytable = mytable + ' <div class="wrapper_nornd bglight">';
    mytable = mytable + '                                           <h6 style="text-align:left;" class="left">$</h6>';
    mytable = mytable + '                                            <input type="text" id="wholesaleCost_' + itemId + '" name="carpetcost_1" class="thinput left" value="' + wholesaleAmount + '" />';
    mytable = mytable + '                                             <div class="clear"></div>';
    mytable = mytable + '                                         </div>';

    mytable = mytable + '                                 	</div>';
    mytable = mytable + '                                 </div>';
    mytable = mytable + '                                 <div class="datacell3">';
    mytable = mytable + '                                 	<div class="cellpad">';
    mytable = mytable + '                                 		<div  class="directional_right"></div>';
    mytable = mytable + '                                  	</div>';
    mytable = mytable + '                                 </div>';
    mytable = mytable + '                                 <div class="datacell4">';
    mytable = mytable + '                                 	<div class="cellpad">';
    mytable = mytable + '                                     	<h6 class="mobileonly mth">Retail Price <span class="sqyd">sq. yd.</span></h6>';
    mytable = mytable + '                                         <div class="wrapper_nornd bglight">';
    mytable = mytable + ' <h6 style="text-align:left;">';
    mytable = mytable + '                                             <span id="retailcostcal_1" class="calculation">' + retailYd + '</span';
    mytable = mytable + '                                             </h6>';
    mytable = mytable + '                                         </div>';

    mytable = mytable + '                                 	</div>';
    mytable = mytable + '                                 </div>';
    mytable = mytable + '                                 <div class="datacell5">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                		<h6 class="mobileonly mth"><span class="sqyd">sq. ft.</span></h6>';
    mytable = mytable + '                                         <div class="right_wrapper_rnd bglight">';
    mytable = mytable + '                                             <h6 style="text-align:left;">';
    mytable = mytable + '                                             <span id="sqftcal_1" class="calculation">' + retailFt + '</span>';
    mytable = mytable + '                                             </h6>';
    mytable = mytable + '                                         </div>';

    mytable = mytable + '                                 	</div>';
    mytable = mytable + '                                 </div>';
    mytable = mytable + '                                 <div class="datacell6">';
    mytable = mytable + '                                 	<div class="cellpad">';
    mytable = mytable + '                                     	<a href="#" id="btnwholesaleCostDelete_' + itemId + '" class="clearx_l"></a>';
    mytable = mytable + '                                     </div>';
    mytable = mytable + '                                     </div>';


    mytable = mytable + '                             </div>';
    mytable = mytable + '                             </div>';

    boolIncludeSave = true;


    $("#tbodyWholesale").append(mytable);



    $("#btnwholesaleCostDelete_" + itemId).click(onWholesaleCostDeleteButtonClick);



    $("#wholesaleCost_" + itemId).blur(onWholesaleCostSaveButtonClick);
    $("#wholesaleProduct_" + itemId).blur(onWholesaleCostSaveButtonClick);
    $("#tableWholesale").trigger("create");



}


function addRetailRow(retailProduct, retailAmountYd, retailAmountFt, wholesaleYd, wholesaleFt, boolIncludeSave, boolIncludeDelete, itemId, retailYd) {

    if (itemId == null || itemId == "") {
        itemId = (new Date()).getTime();

    }

    if (retailYd == undefined || retailYd == null || retailYd == "") {
        retailYd = "true";
    }

    boolIncludeSave = true;



    //var mytable = '<div class="datarow spaced" id="WholesaleToRetailRow" style="display:none">';
    var mytable = ' <div class="clear" ></div>';
    mytable = mytable + '                         <div class="round_wrapper2 bgmed">';

    mytable = mytable + '                            	<div class="datacell1">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                       <h6 class="mobileonly mth">Product Name</h6>';
    mytable = mytable + '                                        <div class="left_wrapper_rnd bglight">';
    mytable = mytable + '                                            <input type="text" id="retailProduct_' + itemId + '" name="productname_' + itemId + '" class="thinput2" value="' + retailProduct + '" />';
    mytable = mytable + '                                        </div>';
    mytable = mytable + '                                    </div>';
    mytable = mytable + '                                </div>';
    mytable = mytable + '                                <div class="datacell2">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                    <h6 class="mobileonly mth">Retail Price <span class="sqyd">sq. yd.</span></h6>';
    mytable = mytable + '                                       <div class="wrapper_nornd bglight">';
    mytable = mytable + '                                           <h6 style="text-align:left;" class="left">$</h6>';
    mytable = mytable + '                                            <input type="text" id="retailCost_' + itemId + '" name="retailCost_" class="thinput left" value="' + retailAmountYd + '" />';
    mytable = mytable + '                                            <div class="clear"></div>';
    mytable = mytable + '                                        </div>';

    mytable = mytable + '                                	</div>';
    mytable = mytable + '                               </div>';
    mytable = mytable + '                               <div class="datacell4">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                    	<h6 class="mobileonly mth"><span class="sqyd">sq. yd.</span></h6>';
    mytable = mytable + '                                        <div class="wrapper_nornd bglight"><h6 style="text-align:left;" class="left">$</h6>';
    mytable = mytable + '                                            <input type="text" id="retailCostFt_' + itemId + '" name="sqft_1" class="thinput left" value="' + retailAmountFt + '" />';
    mytable = mytable + '                                            <div class="clear"></div>';
    mytable = mytable + '                                        </div>';

    mytable = mytable + '                                	</div>';
    mytable = mytable + '                                </div>';
    mytable = mytable + '<div class="datacell3">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                		<div id="btnretailCostSave_' + itemId + '" class="directional_right"></div>';
    mytable = mytable + '                                	</div>';
    mytable = mytable + '                                </div>';
    mytable = mytable + '                                <div class="datacell5">';
    mytable = mytable + '                                	<div class="cellpad">';
    mytable = mytable + '                                		<h6 class="mobileonly mth">Carpet Cost <span class="sqyd">sq. ft.</span></h6>';
    mytable = mytable + '                                        <div class="right_wrapper_rnd bglight">';
    mytable = mytable + '                                            <h6 style="text-align:left;">';
    mytable = mytable + '                                            <span id="Span2" class="calculation">' + wholesaleYd + '</span>';
    mytable = mytable + '                                            </h6>';
    mytable = mytable + '                                        </div>';

    mytable = mytable + '                                	</div>';
    mytable = mytable + '                                </div>';
    mytable = mytable + '                               <div class="datacell6">';
    mytable = mytable + '                               	<div class="cellpad">';
    mytable = mytable + '<a id="btnRetailCostDelete_' + itemId + '" href="#" class="clearx_l"></a>';
    mytable = mytable + '                                    </div>';

    mytable = mytable + '                                </div>';


    mytable = mytable + '                            </div>';
    mytable = mytable + '                            </div>';


    $("#tbodyRetail").append(mytable);


    $("#btnRetailCostDelete_" + itemId).click(onRetailCostDeleteButtonClick);

    $("#retailCost_" + itemId).blur(onRetailCostSaveButtonClick);
    $("#retailCostFt_" + itemId).blur(onRetailCostSaveButtonClick);

    $("#retailCost_" + itemId).click(onSetRetailYd);
    $("#retailCostFt_" + itemId).click(onSetRetailFt);


    $("#retailProduct_" + itemId).blur(onRetailCostSaveButtonClick);
    $("#btnretailCostSave_" + itemId).click(onRetailCostSaveButtonClick);

    $("#tableRetail").trigger("create");



}

function clearAll() {
    //$('#selectDealerSelection option:selected').removeAttr('selected');
    //$('#selectDealerSelection').val('');
    //$("#inputDealerSelection").val('');
    //$("#inputProfitMargin").val('0.00');
    //$("#inputMarkup").val('0.00');

    //$("#inputProfitMarginOrMarkup").val('0');
    //setCheckedAttr("radioMarkup", "false");
    //setCheckedAttr("radioProfitMargin", "false");


    $("#inputCushion").val('0.00');
    setCheckedAttr("checkboxCushion", 'true');

    $("#inputInstallation").val('0.00');
    setCheckedAttr("checkboxInstallation", 'true');
    setDisabledByCheckBox("inputInstallation", 'true');

    $("#inputFreight").val('0.00');
    setCheckedAttr("checkboxFreight", 'true');

    $("#inputOther").val('0.00');
    setCheckedAttr("checkboxOther", 'true');
}



function onWholesaleCostDeleteButtonClick() {
    var myArray = this.id.split('_');
    //var dealerName = global_selectDealerSelection;
    var dealerName = global_selectDealerSelection
    //var productName = $("#wholesaleProduct_" + myArray[1]).val();
    var itemId = myArray[1];

    deleteWholesale(dealerName, itemId);
    setDealerData(dealerName);
}

function onRetailCostDeleteButtonClick() {
    var myArray = this.id.split('_');
    var dealerName = global_selectDealerSelection;
    var productName = $("#retailProduct_" + myArray[1]).val();
    var itemId = myArray[1];

    deleteRetail(dealerName, itemId);
    setDealerData(dealerName);
}


function onSelectDealer() {
    $("#inputDealerSelection").val($("#selectDealerSelection :selected").text());

    setDealerData($("#selectDealerSelection :selected").text());

}

function onAddDealerBtnClick() {

    clearAll();
    var newDealerName = $("#inputDealerSelection").val();

    global_selectDealerSelection = newDealerName;
    global_inputDealerSelection = newDealerName;

    // $("#inputDealerSelection").val(newDealerName);

    //// $('#selectDealerSelection option:selected').removeAttr('selected');
    // $('#selectDealerSelection').val(newDealerName);
    // $("#selectDealerSelection").selectmenu("refresh");
    saveDealer();
    setDealerData(newDealerName);

    $("#inputDealerSelection").focus();


}


$.WholesalePriceCalc = function (dealerName, productName, wholesaleYd, retailYd, retailFt, itemId) {

    this.dealerName = dealerName
    this.productName = productName;
    this.wholesaleYd = wholesaleYd;
    //this.retailYd = retailYd;
    //this.retailFt = retailFt;
    this.itemId = itemId;
}

$.RetailPriceCalc = function (dealerName, productName, wholesaleYd, retailYd, retailFt, itemId) {
    this.dealerName = dealerName
    this.productName = productName;
    this.wholesaleYd = wholesaleYd;
    //this.retailYd = retailYd;
    //this.retailFt = retailFt;
    this.itemId = itemId;
}


$.Dealer = function (name, profit, markup, useprofit, carpetonly, cushion, usecushion, installation, useinstallation, freight, usefreight, other, useother, isRetailYd) {

    this.name = name;
    this.profit = profit;
    this.markup = markup;
    this.useprofit = useprofit;
    this.carpetonly = carpetonly;
    this.cushion = cushion;
    this.usecushion = usecushion;
    this.installation = installation;
    this.useinstallation = useinstallation;
    this.freight = freight;
    this.usefreight = usefreight;
    this.other = other;
    this.useother = useother;
    this.isRetailYd = isRetailYd
}


function setDealerData(dealerName) {

    //get Dealers from storage
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']

    //$('#selectDealerSelection').removeClass("ui-hidden-accessible");

    //$('#inputBtnAdd').removeClass("ui-hidden-accessible");

    if (data == undefined || data == null || data == "") {
        return null;
    }

    Dealers = JSON.parse(data);

    SortedDealers = Dealers.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.name == '') {
            return true;
        }

        if (obj2.name == '') {
            return false;
        }

        return obj1.name > obj2.name;
    });


    //build select 
    //$("#selectDealerSelection").empty();
    //if (dealerName == '') {
    //    $("#selectDealerSelection").append('<option value="" selected >CHOOSE DEALER</option>');
    //}
    //else {
    //    $("#selectDealerSelection").append('<option value=""  >CHOOSE DEALER</option>');
    //}
    $("#contentScroll").empty();
    $.each(SortedDealers, function (index, dealer) {
        var selected = '';
        if (dealer != null) {
            selected = '';
            if (dealer.name == dealerName) {
                selected = 'selected';
            }

            var newEntry = '  <div  class="list_item"  >';
            newEntry = newEntry + '              	<div class="item_name"  >';
            newEntry = newEntry + '                     	<h2 id="profile_' + index + '"' ;
            if(selected == 'selected')
            {
                newEntry = newEntry + '   class="active" ';
            }
            newEntry = newEntry + '  >' + dealer.name + '</h2>';

            newEntry = newEntry + '                         <div class="namedit_wrapper" >';
            newEntry = newEntry + '                         <form id="name_editor_' + index + '" name="name_editor" action="" method="post" onsubmit="applyProfile(\'' + index + '\');" class="fit30">';
            newEntry = newEntry + '                         	<input type="hidden" name="profile_id" value="' + index + '" />';
            newEntry = newEntry + '                             <input type="hidden" id="profile_name_' + index + '" name="profile_name" value="' + dealer.name + '" />';
            newEntry = newEntry + '                         	<input type="text" id="input_profile_' + index + '" name="profile_' + index + '" size="25" class="namedit" value="' + dealer.name + '" />';
            newEntry = newEntry + '                         </form>';
            newEntry = newEntry + '                         <a href="javascript:applyProfile(\'' + index + '\',\'' + dealer.name +  '\');" class="applyit" id="apply_profile_' + index + '"></a>';
            newEntry = newEntry + '                          </div>';

            newEntry = newEntry + '                     </div>';

            newEntry = newEntry + '                     <div class="edt_controls_wrapper">';
            newEntry = newEntry + '                     	<a href="javascript:editProfile(\'' + index + '\',\'' + dealer.name + '\')" class="button_edt left" id="button_edt_pro">Edit Profile Name</a>';
            newEntry = newEntry + '                         <a href="javascript:deleteProfile(\'' + index + '\',\'' + dealer.name + '\')" class="button_edt left" id="button_edt_x">X</a>';

            newEntry = newEntry + '                     </div>';


            newEntry = newEntry + '                 </div>';

            //if (index == 0) {
            //    $('.item_name h2').first().addClass('active');
            //}


            //$("#selectDealerSelection").append('<option value="' + dealer.name + '" ' + selected + ' >' + dealer.name + '</option>');
            $("#contentScroll").append(newEntry);
            $("#profile_" + index).click(function () {
                onDealerSelect("profile_" + index, dealer.name);
            });
        }
    });


   // $('.item_name h2').first().addClass('active');
    $("#contentScroll").fadeIn('fast');



    //$("#selectDealerSelection").selectmenu("refresh");

    //get matching dealer
    var filteredDealer = $.grep(Dealers, function (item) {
        if (item != null) {
            return item.name == dealerName;
        }
        return 0;
    });

    //update UI with data
    var index = 0;
    if (filteredDealer.length > 0) {

        if (filteredDealer[0] == null) {
            index = 1;
        }

        if (filteredDealer[index].profit == null || filteredDealer[index].profit == undefined) {
            filteredDealer[index].profit = "0";
        }

        $("#inputProfitMarginOrMarkup").val(filteredDealer[index].profit);

        if (filteredDealer[index].useprofit.toLowerCase() == "true") {
            setCheckedAttr("radioMarkup", "false");
            setCheckedAttr("radioProfitMargin", "true");

        }
        else {
            setCheckedAttr("radioMarkup", "true");
            setCheckedAttr("radioProfitMargin", "false");

        }

        //if (boolToString(filteredDealer[index].carpetonly).toLowerCase() == "true") {
        if (filteredDealer[index].carpetonly.toLowerCase() == "true") {
            $('#tabInstalled').removeClass('active');
            $('#tabCarpetOnly').addClass('active');
            global_carpetOnly = "true";


        }
        else {
            $('#tabInstalled').addClass('active');
            $('#tabCarpetOnly').removeClass('active');
            global_carpetOnly = "false";
        }

        //TODO REMOVE
        //return;

        //if (filteredDealer[index].isRetailYd == undefined || filteredDealer[index].isRetailYd.toLowerCase() == "true") {
        //    setChecked("radioYdFt1", "true");
        //    setChecked("radioYdFt2", "false");
        //} else {
        //    setChecked("radioYdFt1", "false");
        //    setChecked("radioYdFt2", "true");
        //}


        $("#inputCushion").val(parseFloat(filteredDealer[index].cushion).toFixed(2));
        setCheckedAttr("checkboxCushion", filteredDealer[index].usecushion);


        $("#inputInstallation").val(parseFloat(filteredDealer[index].installation).toFixed(2));
        setCheckedAttr("checkboxInstallation", filteredDealer[index].useinstallation);


        $("#inputFreight").val(parseFloat(filteredDealer[index].freight).toFixed(2));
        setCheckedAttr("checkboxFreight", filteredDealer[index].usefreight);


        $("#inputOther").val(parseFloat(filteredDealer[index].other).toFixed(2));
        setCheckedAttr("checkboxOther", filteredDealer[index].useother);

    }




    setWholesaleData(dealerName);

    setRetailData(dealerName);

}


function getNewDealerName() {
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']
    var maxNumber = 1;
    if (data != undefined && data != null && data != "") {
        Dealers = JSON.parse(data);

        //get matching dealer
        var filteredDealer = $.grep(Dealers, function (item) {
            if (item != null) {
                //return item.name == dealerName;
                var str = item.name;
                var dealerNumber;
                if (str.match("^Dealer_")) {

                    var myArray = item.name.split('_');

                    if (myArray.length > 1) {
                        dealerNumber = parseInt(myArray[1]);
                    }
                    else {
                        dealerNumber = 1;
                    }

                    if (dealerNumber > maxNumber) {
                        maxNumber = dealerNumber
                    }
                    return true;
                }
            }
            return 0;
        });

        return "Dealer_" + (maxNumber + 1).toString();
    }
    return "Dealer_1";
}


function addDealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd) {
    //get Dealers from storage
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']

    if (data != undefined && data != null && data != "") {
        Dealers = JSON.parse(data);

        //get matching dealer
        var filteredDealer = $.grep(Dealers, function (item) {
            if (item != null) {
                return item.name == dealerName;
            }
            return 0;
        });

        //update UI with data
        if (filteredDealer.length > 0) {
            //abandon
            return;
        }
    }
    //create new dealer

    var myDealer = new $.Dealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd);
    Dealers.push(myDealer);


    Dealers.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.name == '') {
            return true;
        }

        if (obj2.name == '') {
            return false;
        }

        return obj1.name > obj2.name;
    });


    //save to storage
    localStorage['mohawkDealers'] = JSON.stringify(Dealers);

}

function getDealerObject(dealerName) {
    //get Dealer from storage
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']
    if (data == undefined || data == null || data == "") {
        return null
    }
    Dealers = JSON.parse(data);

    //get matching dealer
    var filteredDealer = $.grep(Dealers, function (item) {
        if (item != null) {
            return item.name == dealerName;
        }
        return 0;
    });


    if (filteredDealer.length >= 1) {

        return filteredDealer[0];
    }
    return null;

}

function deleteDealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd) {
    //get Dealers from storage
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']

    if (data == undefined && data == null && data == "") {
        return;
    }

    Dealers = JSON.parse(data);

    //get matching dealer
    var filteredDealer = $.grep(Dealers, function (item) {
        if (item != null) {
            return item.name != dealerName;
        }
        return 0;
    });



    if (filteredDealer.length > 0) {
        filteredDealer.sort(function (obj1, obj2) {
            if (obj1 == null) {
                return true;
            }
            if (obj2 == null) {
                return false;
            }

            if (obj1.name == '') {
                return true;
            }

            if (obj2.name == '') {
                return false;
            }

            return obj1.name > obj2.name;
        });
    }

    //save to storage
    localStorage['mohawkDealers'] = JSON.stringify(filteredDealer);

    deleteWholesaleByDealerName(dealerName);
    deleteRetailByDealerName(dealerName);

}


function DAsaveDealer(selectedDealerName, dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd) {
    //get Dealers from storage
    var Dealers = $.makeArray($.Dealer);
    var data = localStorage['mohawkDealers']
    var filteredDealer;

    if (dealerName == null || dealerName == '') {

        return;
    }


    //look for duplicate

    if (data != undefined && data != null && data != "") {

        if (selectedDealerName != dealerName) {
            Dealers = JSON.parse(data);

            //get matching dealer
            filteredDealer = $.grep(Dealers, function (item) {
                if (item != null) {
                    return item.name == dealerName;
                }
                return 0;
            });


            if (filteredDealer.length > 0) {
                alert("Dealer Name Already Exist")
                return;
            }
        }
    }


    if (data != undefined && data != null && data != "") {

        Dealers = JSON.parse(data);

        //get matching dealer
        filteredDealer = $.grep(Dealers, function (item) {
            if (item != null) {
                return item.name != selectedDealerName;
            }
            return 0;
        });


        if (filteredDealer.length < 0) {

            return;
        }
    }
    else {
        var filteredDealer = $.makeArray($.Dealer);
    }
    //create new dealer
    var myDealer = new $.Dealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd);
    filteredDealer.push(myDealer);



    filteredDealer.sort(function (obj1, obj2) {
        if (obj1 == null) {
            return true;
        }
        if (obj2 == null) {
            return false;
        }

        if (obj1.name == '') {
            return true;
        }

        if (obj2.name == '') {
            return false;
        }

        return obj1.name > obj2.name;
    });


    //save to storage
    localStorage['mohawkDealers'] = JSON.stringify(filteredDealer);

}


function onAddDealerClick() {
    var dealerName = $("#inputDealerSelection").val();
    var profitMargin = $("#inputProfitMargin").val();
    var markup = $("#inputMarkup").val();
    var useProfit = $("#radioProfitMargin").is(':checked').toString();
    var carpetonly = $("#radioCarpetOnly").is(':checked').toString();
    var cushion = $("#inputCushion").val();
    var useCushion = $("#checkboxCushion").is(':checked').toString();
    var installation = $("#inputInstallation").val();;
    var useInstallation = $("#checkboxInstallation").is(':checked').toString();
    var freight = $("#inputFreight").val();
    var useFreight = $("#checkboxFreight").is(':checked').toString();
    var other = $("#inputOther").val();
    var useOther = $("#checkboxOther").is(':checked').toString();
    var isRetailYd = $("#retailYdFt1").is(':checked').toString();

    addDealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd);
    setDealerData(dealerName);
    //hideButtons();
}

function onSaveDealerClick() {
    var selectedDealerName = global_selectDealerSelection;
    var newDealerName = global_inputDealerSelection ;
    if (newDealerName == null || newDealerName == '') {
        alert("Enter Dealer Name");
    }



    saveDealer();
    renameWholesaleByDealerName(selectedDealerName, newDealerName);
    renameRetailByDealerName(selectedDealerName, newDealerName);
    setDealerData(newDealerName);
   // hideButtons();
}

function saveDealer() {
    var selectedDealerName = global_selectDealerSelection;
    var dealerName = global_inputDealerSelection;
    if (dealerName == null || dealerName == '') {
        //alert("");
        return;
    }

    var profitMargin = $("#inputProfitMarginOrMarkup").val();

    // var carpetonly = $("#radioCarpetOnly").is(':checked').toString();
    var carpetonly = global_carpetOnly;
    var markup = $("#inputProfitMarginOrMarkup").val();
    var useProfit = $("#radioProfitMargin").is(':checked').toString();

    var cushion = $("#inputCushion").val();
    var useCushion = $("#checkboxCushion").is(':checked').toString();
    var installation = $("#inputInstallation").val();;
    var useInstallation = $("#checkboxInstallation").is(':checked').toString();
    var freight = $("#inputFreight").val();
    var useFreight = $("#checkboxFreight").is(':checked').toString();
    var other = $("#inputOther").val();
    var useOther = $("#checkboxOther").is(':checked').toString();

    var isRetailYd = $("#radioYdFt1").is(':checked').toString();

    if (profitMargin == 'undefined') {
        profitMargin = "0";
    }

    DAsaveDealer(selectedDealerName, dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd);

}



function onCancelDealerClick() {
    var dealerName = $("#inputDealerSelection").val();
    setDealerData(dealerName);
    hideButtons();

}

function onDeleteDealerClick() {
    var selectedDealerName = global_selectDealerSelection;
    var dealerName = global_inputDealerSelection;
    var profitMargin = $("#inputProfitMargin").val();
    var carpetonly = $("#radioCarpetOnly").is(':checked').toString();
    var markup = $("#inputMarkup").val();
    var useProfit = $("#radioProfitMargin").is(':checked').toString();
    var cushion = $("#inputCushion").val();
    var useCushion = $("#checkboxCushion").is(':checked').toString();
    var installation = $("#inputInstallation").val();;
    var useInstallation = $("#checkboxInstallation").is(':checked').toString();
    var freight = $("#inputFreight").val();
    var useFreight = $("#checkboxFreight").is(':checked').toString();;;
    var other = $("#inputOther").val();
    var useOther = $("#checkboxOther").is(':checked').toString();;
    var isRetailYd = $("#radioYdFt1").is(':checked').toString();

    deleteDealer(dealerName, profitMargin, markup, useProfit, carpetonly, cushion, useCushion, installation, useInstallation, freight, useFreight, other, useOther, isRetailYd);
    clearAll();

    //setDealerData(dealerName);
    //hideButtons();
}





function hideButtons() {
    //  $('#inputDealerSelection').removeClass("ui-hidden-accessible");
    //$("#inputBtnAdd").attr('hidden', 'hidden');
    //$("#inputBtnSave").attr('hidden', 'hidden');
    //$("#inputBtnCancel").attr('hidden', 'hidden');
    //$("#inputBtnDelete").attr('hidden', 'hidden');
    //$("#selectDealerSelection").prop('hidden', false);//Chrome
    //$("#selectDealerSelection").attr('hidden', 'hidden'); //IE on <select> tag
    //$("#selectDealerSelection").removeAttr('hidden');
    //$("#inputDealerSelection").attr('hidden', 'hidden');

}

function boolToString(value) {
    if (value == true) {
        return "true";
    }
    return "false";
}

function toBool(str) {
    return str.toLowerCase() == "true";
}

function setChecked(elmentName, trueFalseString) {
    if (toBool(trueFalseString)) {
        $("#" + elmentName).prop('checked', true).checkboxradio("refresh");
    }
    else {
        $("#" + elmentName).prop('checked', false).checkboxradio("refresh");
    }
}

function setCheckedAttr(elmentName, trueFalseString) {
    if (toBool(trueFalseString)) {
        $("#" + elmentName).attr('checked', 'checked');

        //  $("#" + elmentName).checkboxradio("refresh");

    }
    else {
        $("#" + elmentName).removeAttr('checked');
        //  $("#" + elmentName).checkboxradio("refresh");

    }
}

function setDisabledByCheckBox(elementName, stringCheckBoxValue) {
    if (toBool(stringCheckBoxValue) == true) {
        setDisabled(elementName, 'false');
    }
    else {
        setDisabled(elementName, 'true');
    }
}

function setDisabled(elmentName, trueFalseString) {
    if (toBool(trueFalseString)) {
        $("#" + elmentName).prop('disabled', true);;
    }
    else {
        $("#" + elmentName).prop('disabled', false);
    }
}

function setDisabledAttr(elmentName, trueFalseString) {
    if (toBool(trueFalseString)) {
        $("#" + elmentName).attr('disabled', 'disabled');;
    }
    else {
        $("#" + elmentName).removeAttr('disabled');
    }
}