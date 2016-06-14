'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('./utils.js');
var constants = require('./constants.js');
var PaymentTransactionsModule = require('./PaymentTransactions');

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
		PaymentTransactionsModule.authorizeCreditCard(validateFunctionCallback);
	}

	chargeCreditCard(validateFunctionCallback){
		PaymentTransactionsModule.chargeCreditCard(validateFunctionCallback);
	}

	capturePreviouslyAuthorizedAmount(validateFunctionCallback){
		PaymentTransactionsModule.authorizeCreditCard(function(response){
			PaymentTransactionsModule.capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(), 
					validateFunctionCallback);
		});
	}

	captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback){
		PaymentTransactionsModule.captureFundsAuthorizedThroughAnotherChannel(validateFunctionCallback);
	}

	refundTransaction(validateFunctionCallback){
		PaymentTransactionsModule.authorizeCreditCard(function(response){
			PaymentTransactionsModule.capturePreviouslyAuthorizedAmount(response.getTransactionResponse().getTransId(),
				function(captureResponse){
					PaymentTransactionsModule.refundTransaction(captureResponse.getTransactionResponse().getTransId(), validateFunctionCallback);
				});
		});
	}

	voidTransaction(validateFunctionCallback){
		PaymentTransactionsModule.authorizeCreditCard(function(response){
			PaymentTransactionsModule.voidTransaction(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	updateSplitTenderGroup(validateFunctionCallback){
		PaymentTransactionsModule.updateSplitTenderGroup(validateFunctionCallback);
	}

	debitBankAccount(validateFunctionCallback){
		PaymentTransactionsModule.debitBankAccount(validateFunctionCallback);
	}

	creditBankAccount(validateFunctionCallback){
		PaymentTransactionsModule.debitBankAccount(function(response){
			PaymentTransactionsModule.creditBankAccount(response.getTransactionResponse().getTransId(), validateFunctionCallback);
		});
	}

	chargeCustomerProfile(validateFunctionCallback){
		PaymentTransactionsModule.chargeCustomerProfile(validateFunctionCallback);
	}

	chargeTokenizedCreditCard(validateFunctionCallback){
		PaymentTransactionsModule.chargeTokenizedCreditCard(validateFunctionCallback);
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
