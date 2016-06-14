'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('./utils.js');
var constants = require('./constants.js');
var authorizeCreditCardModule = require('./PaymentTransactions/authorize-credit-card.js');
var chargeCreditCardModule = require('./PaymentTransactions/charge-credit-card.js');
var capturePreviouslyAuthorizedAmountModule = require('./PaymentTransactions/capture-previously-authorized-amount.js');
var captureFundsAuthorizedThroughAnotherChannelModule = require('./PaymentTransactions/capture-funds-authorized-through-another-channel.js');
var refundTransactionModule = require('./PaymentTransactions/refund-transaction.js');
var voidTransactionModule = require('./PaymentTransactions/void-transaction.js');
var updateSplitTenderGroupModule = require('./PaymentTransactions/update-split-tender-group.js');
var debitBankAccountModule = require('./PaymentTransactions/debit-bank-account.js');
var creditBankAccountModule = require('./PaymentTransactions/credit-bank-account.js');

class TestRunner {
	validateResponse(response){
		var apiResponse = new ApiContracts.ANetApiResponse(response);
		if(response == null){
			return false;
		}

		if(response.getMessages().getResultCode() != ApiContracts.MessageTypeEnum.OK){
			return false;
		}

		return true;
	}

	authorizeCreditCard(validateFunctionCallback){
		authorizeCreditCardModule.authorizeCreditCard(validateFunctionCallback);
	}

	chargeCreditCard(validateFunctionCallback){
		chargeCreditCardModule.chargeCreditCard(validateFunctionCallback);
	}

	capturePreviouslyAuthorizedAmount(validateFunctionCallback){
		authorizeCreditCardModule.authorizeCreditCard(function(response){
			capturePreviouslyAuthorizedAmountModule.capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(), 
					validateFunctionCallback);
		});
	}

	captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback){
		captureFundsAuthorizedThroughAnotherChannelModule.captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback);
	}

	refundTransaction(validateFunctionCallback){
		authorizeCreditCardModule.authorizeCreditCard(function(response){
			capturePreviouslyAuthorizedAmountModule.capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(),
				function(captureResponse){
					refundTransactionModule.refundTransaction(captureResponse.getTransactionResponse().getTransId(), validateFunctionCallback);
				});
		});
	}

	voidTransaction(validateFunctionCallback){
		authorizeCreditCardModule.authorizeCreditCard(function(response){
			voidTransactionModule.voidTransaction(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	updateSplitTenderGroup(validateFunctionCallback){
		updateSplitTenderGroupModule.updateSplitTenderGroup(validateFunctionCallback);
	}

	debitBankAccount(validateFunctionCallback){
		debitBankAccountModule.debitBankAccount(validateFunctionCallback);
	}

	creditBankAccount(validateFunctionCallback){
		debitBankAccountModule.debitBankAccount(function(response){
			creditBankAccountModule.creditBankAccount(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	callTestMethod(testMethodName, validateFunctionCallback){
		return this[testMethodName](validateFunctionCallback);
	}

	testAllSamples(){
		var lineReader = require('readline').createInterface({
			input: require('fs').createReadStream('./list_of_sample_codes.txt')
		});

		var testRunnerObject = this;

		lineReader.on('line', function (line) {
			console.log('Line from file:', line);
			var sample = line.split(',');
			var apiName = sample[0];
			var shouldApiRun = sample[1].trim()[0];

			if(shouldApiRun == '1'){
				console.log('Running : ' + apiName);
				testRunnerObject.callTestMethod(apiName, function(response) {
					if(!testRunnerObject.validateResponse(response)){
						console.log('Error in running ' + apiName + '. Stopped test runner.');
						return;
					}
				});
			}
		});
	}
}

var testRunner  = new TestRunner();
testRunner.testAllSamples();
