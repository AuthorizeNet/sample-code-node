'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function createCustomerProfileFromTransaction(transactionId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var createRequest = new ApiContracts.CreateCustomerProfileFromTransactionRequest();
	createRequest.setTransId(transactionId);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);

	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.CreateCustomerProfileFromTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateCustomerProfileResponse(apiResponse);
		//console.log(JSON.stringify(response.getJSON(), null, 2));
		
		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully created a customer payment profile with id: ' + response.getCustomerProfileId() + 
					' from a transaction : ' + transactionId );
			}
			else
			{
				//console.log(JSON.stringify(response));
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);

	});
}

if (require.main === module) {
	createCustomerProfileFromTransaction('2259984863', function(){
		console.log("createCustomerProfileFromTransaction call complete.");
	});
}

module.exports.createCustomerProfileFromTransaction = createCustomerProfileFromTransaction;