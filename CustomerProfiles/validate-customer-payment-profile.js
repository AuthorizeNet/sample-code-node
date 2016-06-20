'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function validateCustomerPaymentProfile(customerProfileId, customerPaymentProfileId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var validateRequest = new ApiContracts.ValidateCustomerPaymentProfileRequest();
	validateRequest.setMerchantAuthentication(merchantAuthenticationType);
	validateRequest.setCustomerProfileId(customerProfileId);	
	validateRequest.setCustomerPaymentProfileId(customerPaymentProfileId);
	validateRequest.setValidationMode(ApiContracts.ValidationModeEnum.LIVEMODE);
	validateRequest.setCardCode('122');

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ValidateCustomerPaymentProfileController(validateRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ValidateCustomerPaymentProfileResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully validated the customer payment profile with id : ' + customerPaymentProfileId);
			}
			else
			{
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
	validateCustomerPaymentProfile('41003872', '37300636', function(){
		console.log("validateCustomerPaymentProfile call complete.");
	});
}

module.exports.validateCustomerPaymentProfile = validateCustomerPaymentProfile;