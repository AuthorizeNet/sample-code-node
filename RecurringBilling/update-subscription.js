/* eslint-disable no-console */
"use strict";

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var utils = require("../utils.js");
var constants = require("../constants.js");

function updateSubscription(subscriptionId, callback) {
  var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(constants.apiLoginKey);
  merchantAuthenticationType.setTransactionKey(constants.transactionKey);

  var updatedCreditCardInfo = new ApiContracts.CreditCardType();
  updatedCreditCardInfo.setCardNumber("4111111111111111");
  updatedCreditCardInfo.setExpirationDate("2038-12");

  var payment = new ApiContracts.PaymentType();
  payment.setCreditCard(updatedCreditCardInfo);

  var orderType = new ApiContracts.OrderType();
  orderType.setInvoiceNumber(utils.getRandomString("Inv:"));
  orderType.setDescription(utils.getRandomString("Description"));

  var arbSubscriptionType = new ApiContracts.ARBSubscriptionType();
  arbSubscriptionType.setOrder(orderType);
  arbSubscriptionType.setPayment(payment);

  var updateRequest = new ApiContracts.ARBUpdateSubscriptionRequest();
  updateRequest.setMerchantAuthentication(merchantAuthenticationType);
  updateRequest.setSubscriptionId(subscriptionId);
  updateRequest.setSubscription(arbSubscriptionType);

  console.log(JSON.stringify(updateRequest.getJSON(), null, 2));

  var ctrl = new ApiControllers.ARBUpdateSubscriptionController(
    updateRequest.getJSON()
  );

  ctrl.execute(function () {
    var apiResponse = ctrl.getResponse();

    var response = new ApiContracts.ARBUpdateSubscriptionResponse(apiResponse);

    console.log(JSON.stringify(response, null, 2));

    if (response != null) {
      if (
        response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK
      ) {
        console.log(
          "Message Code : " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Message Text : " + response.getMessages().getMessage()[0].getText()
        );
      } else {
        console.log("Result Code: " + response.getMessages().getResultCode());
        console.log(
          "Error Code: " + response.getMessages().getMessage()[0].getCode()
        );
        console.log(
          "Error message: " + response.getMessages().getMessage()[0].getText()
        );
      }
    } else {
      console.log("Null Response.");
    }

    callback(response);
  });
}

if (require.main === module) {
  updateSubscription("4058648", function () {
    console.log("getSubscription call complete.");
  });
}

module.exports.updateSubscription = updateSubscription;
