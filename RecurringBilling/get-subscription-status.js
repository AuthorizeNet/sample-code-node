'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getSubscriptionStatus(subscriptionId, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var getRequest = new ApiContracts.ARBGetSubscriptionStatusRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setSubscriptionId(subscriptionId);

	console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ARBGetSubscriptionStatusController(getRequest.getJSON());

	ctrl.execute(function(){
		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ARBGetSubscriptionStatusResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Status : ' + response.getStatus());
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
	getSubscriptionStatus('4058648', function(){
		console.log('getSubscriptionStatus call complete.');
	});
}

module.exports.getSubscriptionStatus = getSubscriptionStatus;