"use strict";

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
merchantAuthenticationType.setName(constants.apiLoginKey);
merchantAuthenticationType.setTransactionKey(constants.transactionKey);

var creditCard = new ApiContracts.CreditCardType();
creditCard.setCardNumber("4242424242424242");
creditCard.setExpirationDate("0822");

var paymentType = new ApiContracts.PaymentType();
paymentType.setCreditCard(creditCard);

var transactionRequestType = new ApiContracts.TransactionRequestType();
transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.REFUNDTRANSACTION);
transactionRequestType.setPayment(paymentType);
transactionRequestType.setAmount(utils.getRandomAmount());
transactionRequestType.setRefTransId("2312312332");

var createRequest = new ApiContracts.CreateTransactionRequest();
createRequest.setMerchantAuthentication(merchantAuthenticationType);
createRequest.setTransactionRequest(transactionRequestType);

//pretty print request
//console.log(JSON.stringify(createRequest.getJSON(), null, 2));
	
var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

ctrl.execute(function(){

	var apiResponse = ctrl.getResponse();

	var response = new ApiContracts.CreateTransactionResponse(apiResponse);

	//pretty print response
	//console.log(JSON.stringify(response, null, 2));

	if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK && 
		response.getTransactionResponse().getResponseCode() == "1"){
		console.log("Transaction ID: " + response.getTransactionResponse().getTransId());
	}
	else{
		console.log("Result Code: " + response.getMessages().getResultCode());
	}

});
