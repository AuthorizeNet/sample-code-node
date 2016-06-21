'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getSettledBatchList(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var createRequest = new ApiContracts.GetSettledBatchListRequest();
	createRequest.setMerchantAuthentication(merchantAuthenticationType);
	createRequest.setIncludeStatistics(true);
	createRequest.setFirstSettlementDate('2015-05-01T16:00:00Z');
	createRequest.setLastSettlementDate('2015-05-31T16:00:00Z');

	console.log(JSON.stringify(createRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetSettledBatchListController(createRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetSettledBatchListResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());

				if(response.getBatchList() != null){
					var batchItems = response.getBatchList().getBatch();
					for (var i=0;i<batchItems.length;i++)
					{
						console.log('Batch Id : ' + batchItems[i].getBatchId());
						console.log('Settlement State : ' + batchItems[i].getSettlementState());
						console.log('Payment Method : ' + batchItems[i].getPaymentMethod());
						console.log('Product : ' + batchItems[i].getProduct());
					}
				}
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
	getSettledBatchList(function(){
		console.log('getSettledBatchList call complete.');
	});
}

module.exports.getSettledBatchList = getSettledBatchList;