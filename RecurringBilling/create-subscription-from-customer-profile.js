'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function createSubscriptionFromCustomerProfile(customerProfileId, customerPaymentProfileId, customerAddressId, callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var interval = new ApiContracts.PaymentScheduleType.Interval();
	interval.setLength(1);
	interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

	var paymentScheduleType = new ApiContracts.PaymentScheduleType();
	paymentScheduleType.setInterval(interval);
	paymentScheduleType.setStartDate(utils.getDate());
	paymentScheduleType.setTotalOccurrences(5);
	paymentScheduleType.setTrialOccurrences(0);

	var customerProfileIdType = new ApiContracts.CustomerProfileIdType();
	customerProfileIdType.setCustomerProfileId(customerProfileId);
	customerProfileIdType.setCustomerPaymentProfileId(customerPaymentProfileId);
	customerProfileIdType.setCustomerAddressId(customerAddressId);

	var arbSubscription = new ApiContracts.ARBSubscriptionType();
	arbSubscription.setName(utils.getRandomString('Name'));
	arbSubscription.setPaymentSchedule(paymentScheduleType);
	arbSubscription.setAmount(utils.getRandomAmount());
	arbSubscription.setTrialAmount(utils.getRandomAmount());
	arbSubscription.setProfile(customerProfileIdType);

	var createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setSubscription(arbSubscription);

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.ARBCreateSubscriptionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.ARBCreateSubscriptionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Subscription Id : ' + response.getSubscriptionId());
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
	createSubscriptionFromCustomerProfile('123123', '123123', '123123', function(){
		console.log('createSubscriptionFromCustomerProfile call complete.');
	});
}

module.exports.createSubscriptionFromCustomerProfile = createSubscriptionFromCustomerProfile;