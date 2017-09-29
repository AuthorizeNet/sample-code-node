"use strict";

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var utils = require("../utils.js");
var constants = require("../constants.js");

function getCustomerPaymentProfileList(callback) {

	// Create a merchantAuthenticationType object with authentication details
    // retrieved from the constants file
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	// Set the transaction"s refId
	var refId = utils.getRandomInt();

    // Set the paging (this particular API call will only return up to 10 results at a time)
	var paging = new ApiContracts.Paging();
	paging.setLimit(10);
	paging.setOffset(1);

    // Set the sorting
    var sorting = new ApiContracts.CustomerPaymentProfileSorting;
    sorting.setOrderBy(ApiContracts.CustomerPaymentProfileOrderFieldEnum.ID);
    sorting.setOrderDescending(false);

	// Set search parameters
	var search = ApiContracts.CustomerPaymentProfileSearchTypeEnum.CARDSEXPIRINGINMONTH;
    var month = "2020-12";

	// Creating the request with the required parameters
	var getRequest = new ApiContracts.GetCustomerPaymentProfileListRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setRefId(refId);
	getRequest.setPaging(paging);
	getRequest.setSorting(sorting);
	getRequest.setSearchType(search);
	getRequest.setMonth(month);

	// uncomment to print request
	// console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetCustomerPaymentProfileListController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetCustomerPaymentProfileListResponse(apiResponse);

		// uncomment to print response
		// console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log("SUCCESS");
				console.log("Total Num in Result Set: " + response.getTotalNumInResultSet());
				var profiles = response.getPaymentProfiles().getPaymentProfile();
				for (var i=0;i<profiles.length;i++)
				{
					console.log("Profile ID: " + profiles[i].getCustomerProfileId());
					console.log("Payment Profile ID: " + profiles[i].getCustomerPaymentProfileId());					
					if(profiles[i].payment.creditCard)
					{
						console.log("Card: " + profiles[i].payment.creditCard.cardNumber);
					}
					else if(profiles[i].payment.bankAccount)
					{
						console.log("Bank Account: " + profiles[i].payment.bankAccount.accountNumber);
					}		
					console.log("");
				}
			}
			else
			{
				console.log("Result Code: " + response.getMessages().getResultCode());
				console.log("Error Code: " + response.getMessages().getMessage()[0].getCode());
				console.log("Error Message: " + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log("Null response received");
		}

		callback(response);
	});
}

if (require.main === module) {
	getCustomerPaymentProfileList(function(){
		console.log("getCustomerPaymentProfileList call complete.");
	});
}

module.exports.getCustomerPaymentProfileList = getCustomerPaymentProfileList;