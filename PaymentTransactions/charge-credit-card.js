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


var lineItem_1 = new ApiContracts.LineItemType();
lineItem_1.setItemId("1");
lineItem_1.setName("vase");
lineItem_1.setDescription("cannes logo");
lineItem_1.setQuantity("18");
lineItem_1.setUnitPrice("45.00");

var lineItem_2 = new ApiContracts.LineItemType();
lineItem_2.setItemId("2");
lineItem_2.setName("vase2");
lineItem_2.setDescription("cannes logo2");
lineItem_2.setQuantity("28");
lineItem_2.setUnitPrice("25.00");

var lineItemList = [];
lineItemList.push(lineItem_1);
lineItemList.push(lineItem_2);

var lineItems = new ApiContracts.ArrayOfLineItem();
lineItems.setLineItem(lineItemList);

var userField_a = new ApiContracts.UserField();
userField_a.setName("A");
userField_a.setValue("Aval");

var userField_b = new ApiContracts.UserField();
userField_b.setName("B");
userField_b.setValue("Bval");

var userFieldList = [];
userFieldList.push(userField_a);
userFieldList.push(userField_b);

var userFields = new ApiContracts.TransactionRequestType.UserFields();
userFields.setUserField(userFieldList);

var transactionSetting_1 = new ApiContracts.SettingType();
transactionSetting_1.setSettingName("testRequest");
transactionSetting_1.setSettingValue("s1val");

var transactionSetting_2 = new ApiContracts.SettingType();
transactionSetting_2.setSettingName("testRequest");
transactionSetting_2.setSettingValue("s2val");

var transactionSettingList = [];
transactionSettingList.push(transactionSetting_1);
transactionSettingList.push(transactionSetting_2);

var transactionSettings = new ApiContracts.ArrayOfSetting();
transactionSettings.setSetting(transactionSettingList);

var transactionRequestType = new ApiContracts.TransactionRequestType();
transactionRequestType.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
transactionRequestType.setPayment(paymentType);
transactionRequestType.setAmount(utils.getRandomAmount());
transactionRequestType.setLineItems(lineItems);
transactionRequestType.setUserFields(userFields);
transactionRequestType.setTransactionSettings(transactionSettings);

var createRequest = new ApiContracts.CreateTransactionRequest();
createRequest.setMerchantAuthentication(merchantAuthenticationType);
createRequest.setTransactionRequest(transactionRequestType);

//pretty print request
console.log(JSON.stringify(createRequest.getJSON(), null, 2));
	
var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

ctrl.execute(function(){

	var apiResponse = ctrl.getResponse();

	var response = new ApiContracts.CreateTransactionResponse(apiResponse);

	//pretty print response
	console.log(JSON.stringify(response, null, 2));

	if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK && 
		response.getTransactionResponse().getResponseCode() == "1"){
		console.log("Transaction ID: " + response.getTransactionResponse().getTransId());
	}
	else{
		console.log("Result Code: " + response.getMessages().getResultCode());
	}

});