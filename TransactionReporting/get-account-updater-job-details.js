'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');


function getaccountupdaterJobDetails(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);
	var month = '2018-08';
	var modifiedTypeFilter = 'all';
	var refId = '123456'
	var paging = new ApiContracts.Paging();
	paging.setLimit(36);
	paging.setOffset(1);
	var subscriptionId = [];
	var getRequest = new ApiContracts.GetAUJobDetailsRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setMonth(month);
	getRequest.setPaging(paging);
	getRequest.setModifiedTypeFilter(modifiedTypeFilter);
	getRequest.setRefId(refId);

	var ctrl = new ApiControllers.GetAUJobDetailsController(getRequest.getJSON());
	ctrl.execute(function () {
		var apiResponse = ctrl.getResponse();
		var response = new ApiContracts.GetAUJobDetailsResponse(apiResponse);

		if (response != null) {
			if (response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK) {

				if (response.getAuDetails == null)
					return response;
				else {
					console.log('RefId :' + response.refId)
					console.log('Result Code: ' + response.getMessages().getResultCode());
					console.log('Total No In Result Set Is :-' + response.totalNumInResultSet)
					var audetails = response.getAuDetails()
					var auupdate = audetails.auUpdate

					for (var i = 0; i < auupdate.length; i++) {

						console.log("**** AU Update Start ****'")
						console.log("\t" + 'Customer Profile ID:' + auupdate[i].getCustomerProfileID());
						console.log("\t" + 'Customer Payment Profile ID:' + auupdate[i].getCustomerPaymentProfileID());
						console.log("\t" + 'First Name:' + auupdate[i].getFirstName());
						console.log("\t" + 'Last Name:' + auupdate[i].getLastName());
						console.log("\t" + 'Update Time UTC:' + auupdate[i].getUpdateTimeUTC());
						console.log("\t" + 'Reason Code:' + auupdate[i].getAuReasonCode());
						console.log("\t" + 'Reason Description:' + auupdate[i].getReasonDescription());


						if ((auupdate[i].getNewCreditCard()) != null) {
							var newcreditcard = auupdate[i].getNewCreditCard()
							console.log("Fetching New Credit Card Details:-")
							console.log("\t" + 'Card Number:' + newcreditcard.getCardNumber())
							console.log("\t" + 'Expiration Date:' + newcreditcard.getExpirationDate())
							console.log("\t" + 'Card Type:' + newcreditcard.getCardType())
						}
						if ((auupdate[i].getOldCreditCard()) != null) {
							var oldcreditcard = auupdate[i].getOldCreditCard()
							console.log("Fetching Old Credit Card Details:-")
							console.log("\t" + 'Card Number:' + newcreditcard.getCardNumber())
							console.log("\t" + 'Expiration Date:' + newcreditcard.getExpirationDate())
							console.log("\t" + 'Card Type:' + newcreditcard.getCardType())
						}
						if ((auupdate[i].getSubscriptionIdList()) != null) {
							console.log("\t" + 'Subscription Id list:');
							var subscriptionids = auupdate[i].getSubscriptionIdList()
							var subs = subscriptionids.subscriptionId
							for (var j = 0; j < subs.length; j++) {
								console.log("\t" + 'Subscription Id:' + subs[j])
							}
						}
						console.log("**** AU Update END ****'")
					}
					var audelete = audetails.auDelete
					for (var i = 0; i < audelete.length; i++) {
						console.log("**** AU Delete Start ****'")
						console.log("\t" + 'Customer Profile ID:' + audelete[i].getCustomerProfileID());
						console.log("\t" + 'Customer Payment Profile ID:' + audelete[i].getCustomerPaymentProfileID());
						console.log("\t" + 'First Name:' + audelete[i].getFirstName());
						console.log("\t" + 'Last Name:' + audelete[i].getLastName());
						console.log("\t" + 'Update Time UTC:' + audelete[i].getUpdateTimeUTC());
						console.log("\t" + 'Reason Code:' + audelete[i].getAuReasonCode());
						console.log("\t" + 'Reason Description:' + audelete[i].getReasonDescription());

						if ((audelete[i].getCreditCard()) != null) {
							var creditcard = audelete[i].getCreditCard()
							console.log("\t" + 'Card Number:' + creditcard.getCardNumber())
							console.log("\t" + 'Expiration Date:' + creditcard.getExpirationDate())
							console.log("\t" + 'Card Type:' + creditcard.getCardType())
						}
						if ((audelete[i].getSubscriptionIdList()) != null) {
							console.log("\t" + 'Subscription Id list:');
							var subscriptionids = audelete[i].getSubscriptionIdList()
							var subs = subscriptionids.subscriptionId
							for (var j = 0; j < subs.length; j++) {
								console.log("\t" + 'Subscription Id:' + subs[j])
							}
						}
						console.log("**** AU Delete END ****'")
					}
				}

			}
			else {
				console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else {
			console.log('Null response received');
		}
		callback(response);
	});
}
if (require.main === module) {
	getaccountupdaterJobDetails(function () {
		console.log('getAUJobDetails call complete.');
	});
}

module.exports.getaccountupdaterJobDetails = getaccountupdaterJobDetails;
