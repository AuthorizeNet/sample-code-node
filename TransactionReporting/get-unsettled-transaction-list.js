'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function getUnsettledTransactionList(callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    var getRequest = new ApiContracts.GetUnsettledTransactionListRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);

    console.log(JSON.stringify(getRequest.getJSON(), null, 2));
        
    var ctrl = new ApiControllers.GetUnsettledTransactionListController(getRequest.getJSON());

    ctrl.execute(function(){

        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.GetUnsettledTransactionListResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        if(response != null){
             if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
                console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
            }
            else{
                console.log('Result Code: ' + response.getMessages().getResultCode());
            }
        }
        else{
            console.log('Null Response.');
        }
        
        callback(response);
    });
}

if (require.main === module) {
    getUnsettledTransactionList(function(){
        console.log("getUnsettledTransactionList call complete.");
    });
}

module.exports.getUnsettledTransactionList = getUnsettledTransactionList;