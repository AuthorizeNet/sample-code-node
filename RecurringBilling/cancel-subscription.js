'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function cancelSubscription(subscriptionId, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
	cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
	cancelRequest.setSubscriptionId(subscriptionId);

	console.log(JSON.stringify(cancelRequest.getJSON(), null, 2));

	var ctrl = new ApiControllers.ARBCancelSubscriptionController(cancelRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		if (apiResponse != null) var response = new ApiContracts.ARBCancelSubscriptionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
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
			var apiError = ctrl.getError();
			console.log(apiError);
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	cancelSubscription('4058648', function(){
		console.log('cancelSubscription call complete.');
	});
}

module.exports.cancelSubscription = cancelSubscription;