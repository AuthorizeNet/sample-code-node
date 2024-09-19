'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function createGooglePayTransaction(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var opaqueData = new ApiContracts.OpaqueDataType();
	opaqueData.setDataDescriptor('COMMON.GOOGLE.INAPP.PAYMENT');
	opaqueData.setDataValue('1234567890ABCDEF1111AAAA2222BBBB3333CCCC4444DDDD5555EEEE6666FFFF7777888899990000');

	var payment = new ApiContracts.PaymentType();
	payment.setOpaqueData(opaqueData);

    var lineItem = new ApiContracts.LineItemType();
    lineItem.setItemId("1");    
    lineItem.setName("vase");
    lineItem.setDescription("Cannes logo");
    lineItem.setQuantity(18);
    lineItem.setUnitPrice(utils.getRandomAmount());

    var lineItemsArray = new ApiContracts.ArrayOfLineItem();
    lineItemsArray.setLineItem(lineItem);

    var tax = new ApiContracts.ExtendedAmountType();
    tax.setAmount(utils.getRandomAmount());
    tax.setName("level2 tax name");
    tax.setDescription("level2 tax");

    var userField = new ApiContracts.UserField();
    var userFields = new ApiContracts.TransactionRequestType.UserFields();

    userField.setName("UserDefinedFieldName1");
    userField.setValue("UserDefinedFieldValue1");
    userFields.setUserField(userField);

    userField.setName("UserDefinedFieldName2");
    userField.setValue("UserDefinedFieldValue2");
    userFields.setUserField(userField);

	var transactionRequest = new ApiContracts.TransactionRequestType();
	transactionRequest.setAmount(utils.getRandomAmount());
	transactionRequest.setTransactionType(ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION);
	transactionRequest.setPayment(payment);
    transactionRequest.setLineItems(lineItemsArray);
    transactionRequest.setTax(tax);
    transactionRequest.setUserFields(userFields);

	var createRequest = new ApiContracts.CreateTransactionRequest();
	createRequest.setTransactionRequest(transactionRequest);
	createRequest.setMerchantAuthentication(merchantAuthenticationType);

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));

	var ctrl = new ApiControllers.CreateTransactionController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		if (apiResponse != null) var response = new ApiContracts.CreateTransactionResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));
		
		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactionResponse().getMessages() != null){
					console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
					console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
					console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
					console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
				}
				else {
					console.log('Failed Transaction.');
					if(response.getTransactionResponse().getErrors() != null){
						console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
						console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
					}
				}
			}
			else {
				console.log('Failed Transaction. ');
				if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
				
					console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
					console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
				}
				else {
					console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
					console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
				}
			}
		}
		else {
			var apiError = ctrl.getError();
			console.log(apiError);
			console.log('Null Response.');
		}
		
		callback(response);
	});
}

if (require.main === module) {
	createGooglePayTransaction(function(){
		console.log('createGooglePayTransaction call complete.');
	});
}

module.exports.createGooglePayTransaction = createGooglePayTransaction;
