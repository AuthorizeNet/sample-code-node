'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function paypalVoid(transactionId, callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    var payPalType = new ApiContracts.PayPalType();
    payPalType.setCancelUrl('http://www.merchanteCommerceSite.com/Success/TC25262');
    payPalType.setSuccessUrl('http://www.merchanteCommerceSite.com/Success/TC25262');

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setPayPal(payPalType);

    var txnRequest = new ApiContracts.TransactionRequestType();
    txnRequest.setTransactionType(ApiContracts.TransactionTypeEnum.VOIDTRANSACTION);
    txnRequest.setPayment(paymentType);
    txnRequest.setRefTransId(transactionId);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(txnRequest);

    console.log(JSON.stringify(createRequest.getJSON(), null, 2));
        
    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

    ctrl.execute(function(){

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.CreateTransactionResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        if(response != null){
            if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                console.log('Transaction ID: ' + response.getTransactionResponse().getTransId());
            }
            else{
                console.log('Result Code: ' + response.getMessages().getResultCode());
            }
        }
        else {
            console.log('Null Response.');
        }
        
        callback(response);
    });
}

if (require.main === module) {
    paypalVoid('2259813941', function(){
        console.log("paypalVoid call complete.");
    });
}

module.exports.paypalVoid = paypalVoid;