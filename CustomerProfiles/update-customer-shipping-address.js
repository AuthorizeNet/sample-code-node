'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function updateCustomerShippingAddress(customerProfileId, customerAddressId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var creditCardForUpdate = new ApiContracts.CreditCardType();
	creditCardForUpdate.setCardNumber('4111111111111111');
	creditCardForUpdate.setExpirationDate('2023-12');

	var paymentType = new ApiContracts.PaymentType();
	paymentType.setCreditCard(creditCardForUpdate);

	var customerShippingAddressForUpdate = new ApiContracts.CustomerAddressExType();
	customerShippingAddressForUpdate.setFirstName('Will');
	customerShippingAddressForUpdate.setLastName('Smith');
	customerShippingAddressForUpdate.setAddress('345 Main St.');
	customerShippingAddressForUpdate.setCity('Bellevue');
	customerShippingAddressForUpdate.setState('WA');
	customerShippingAddressForUpdate.setZip('98004');
	customerShippingAddressForUpdate.setCountry('USA');
	customerShippingAddressForUpdate.setPhoneNumber('333-333-3333');
	customerShippingAddressForUpdate.setCustomerAddressId(customerAddressId);

	var updateRequest = new ApiContracts.UpdateCustomerShippingAddressRequest();
	updateRequest.setMerchantAuthentication(merchantAuthenticationType);
	updateRequest.setCustomerProfileId(customerProfileId);	
	updateRequest.setAddress(customerShippingAddressForUpdate);

	//pretty print request
	//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.UpdateCustomerShippingAddressController(updateRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		if (apiResponse != null) var response = new ApiContracts.UpdateCustomerShippingAddressResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Successfully updated a customer shipping profile with id: ' + customerAddressId);
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
			var apiError = ctrl.getError();
			console.log(apiError);
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	updateCustomerShippingAddress('1929176981', '900520864', function(){
		console.log('updateCustomerShippingAddress call complete.');
	});
}

module.exports.updateCustomerShippingAddress = updateCustomerShippingAddress;