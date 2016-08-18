'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function createApplePayTransaction(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var opaqueData = new ApiContracts.OpaqueDataType();
	opaqueData.setDataDescriptor('COMMON.ACCEPT.INAPP.PAYMENT');
	opaqueData.setDataValue('9471471570959063005001');

	var payment = new ApiContracts.PaymentType();
	payment.setOpaqueData(opaqueData);

	var transactionRequest = new ApiContracts.TransactionRequestType();
	transactionRequest.setAmount(utils.getRandomAmount());
	transactionRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequest.setPayment(payment);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setTransactionRequest(transactionRequest);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));

	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));
		
		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK && 
				response.getTransactionResponse().getResponseCode() == '1'){
				console.log('Transaction ID: ' + response.getTransactionResponse().getTransId());
			}
			else{
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());

			}
		}
		else {
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	createApplePayTransaction(function(){
		console.log('createApplePayTransaction call complete.');
	});
}

module.exports.createApplePayTransaction = createApplePayTransaction;