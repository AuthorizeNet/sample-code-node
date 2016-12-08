'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getUnsettledTransactionList(callback) {
	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);

	var getRequest = new ApiContracts.GetUnsettledTransactionListRequest();

	var paging = new ApiContracts.Paging();
	paging.setLimit(10);
	paging.setOffset(1);

	var sorting = new ApiContracts.TransactionListSorting();
	sorting.setOrderBy(ApiContracts.TransactionListOrderFieldEnum.ID);
	sorting.setOrderDescending(true);

	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setStatus(ApiContracts.TransactionGroupStatusEnum.PENDINGAPPROVAL);
	getRequest.setPaging(paging);
	getRequest.setSorting(sorting);

	console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetUnsettledTransactionListController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetUnsettledTransactionListResponse(apiResponse);

		console.log(JSON.stringify(response, null, 2));

		if(response != null){
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
				if(response.getTransactions() != null){
					var transactions = response.getTransactions().getTransaction();
					for (var i=0;i<transactions.length;i++)
					{
						console.log('Transaction Id : ' + transactions[i].getTransId());
						console.log('Transaction Status : ' + transactions[i].getTransactionStatus());
						console.log('Amount Type : ' + transactions[i].getAccountType());
						console.log('Settle Amount : ' + transactions[i].getSettleAmount());
					}
				}
				console.log('Message Code : ' + response.getMessages().getMessage()[0].getCode());
				console.log('Message Text : ' + response.getMessages().getMessage()[0].getText());
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
	getUnsettledTransactionList(function(){
		console.log('getUnsettledTransactionList call complete.');
	});
}

module.exports.getUnsettledTransactionList = getUnsettledTransactionList;