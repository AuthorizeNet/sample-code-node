'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function authorizationAndCaptureContinued(transactionId, callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    var payPalType = new ApiContracts.PayPalType();
    payPalType.setCancelUrl('http://www.merchanteCommerceSite.com/Success/TC25262');
    payPalType.setSuccessUrl('http://www.merchanteCommerceSite.com/Success/TC25262');
    payPalType.setPayerID('B2LA5T27DMX7G');

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setPayPal(payPalType);

    var txnRequest = new ApiContracts.TransactionRequestType();
    txnRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURECONTINUETRANSACTION);
    txnRequest.setPayment(paymentType);
    txnRequest.setAmount(utils.getRandomAmount());
    txnRequest.setRefTransId(transactionId);

    var createRequest = new ApiContracts.CreateTransactionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setTransactionRequest(txnRequest);

    console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

    ctrl.execute(function () {

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.CreateTransactionResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        if (response !== null) {
            if (response.getMessages().getResultCode() === ApiContracts.MessageTypeEnum.OK) {
                if (response.getTransactionResponse().getMessages() !== null) {
                    console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
                    console.log('Payer Id: ' + response.getTransactionResponse().getSecureAcceptance().getPayerID());
                    console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
                    console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
                    console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
                } else {
                    console.log('Failed Transaction.');
                    if (response.getTransactionResponse().getErrors() !== null) {
                        console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                        console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                    }
                }
            } else {
                console.log('Failed Transaction. ');
                if (response.getTransactionResponse() !== null && response.getTransactionResponse().getErrors() !== null) {
                    console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
                    console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
                } else {
                    console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                    console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
                }
            }
        } else {
            console.log('Null Response.');
        }

        callback(response);
    });
}

if (require.main === module) {
    authorizationAndCaptureContinued('2260016287', function () {
        console.log('authorizationAndCaptureContinued call complete.');
    });
}

module.exports.authorizationAndCaptureContinued = authorizationAndCaptureContinued;