'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getTransactionDetails(transactionId, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var getRequest = new ApiContracts.GetTransactionDetailsRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setTransId(transactionId);

	console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetTransactionDetailsController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetTransactionDetailsResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Transaction Id : ' + response.getTransaction().getTransId());
				console.log('Transaction Type : ' + response.getTransaction().getTransactionType());
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else{
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	getTransactionDetails('2259796597', function(){
		console.log('getTransactionDetails call complete.');
	});
}

module.exports.getTransactionDetails = getTransactionDetails;