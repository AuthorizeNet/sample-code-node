'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getCustomerPaymentProfileNonce(customerProfileId, customerPaymentProfileId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    var getRequest = new ApiContracts.GetCustomerPaymentProfileNonceRequest();
    getRequest.setConnectedAccessToken("eyJraWQiOiI1YWI2NTIxNDBlZGU3ZWZkMDAwMDAwMDA1NGNlOWRhOCIsImFsZyI6IlJTMjU2In0.eyJqdGkiOiIyMGIyYWU1Ni1hZjk4LTQ5OWMtOTczOS04ZDg1MWQ3YjBkMDIiLCJzY29wZXMiOlsicmVhZCIsIndyaXRlIl0sImlhdCI6MTU0MzM5OTYwOTU0NiwiYXNzb2NpYXRlZF9pZCI6IjM3ODciLCJjbGllbnRfaWQiOiJ4ZVFmcFJSSTVYIiwibWVyY2hhbnRfaWQiOiI2NjgzOTQiLCJhZGRpdGlvbmFsSW5mbyI6IntcImFwaUxvZ2luSWRcIjpcIjI1TDdLVmd3NyAgICAgICAgICAgXCIsXCJyb3V0aW5nSWRcIjpcIiQkMjVMN0tWZ3c3JCRcIn0iLCJleHBpcmVzX2luIjoxNTQzNDI4NDA5NTQ4LCJncmFudF90eXBlIjoiYXV0aG9yaXphdGlvbl9jb2RlIiwic29sdXRpb25faWQiOiJBQUExMDI5MjIifQ.JQL3YovrTOuh3UaBGLxP8RNbzGGeJ1Id309lysnMcRJEYDCpv6999A4n6Yznr6uzePjpEwbiyd2osDoGnrP_wQmpLwGPR3eBb3DIOiAhKuAbc1YdpsNa3rd2qbVHPFO95_x2y6r7yRCvgNiRx01GFOXphZ3gPrSuHd93U-h0OLd6nt2GKQQcZ8IQ7f-44fViNgLEH_FTPETKAaooSK8v4XFa7Fh3rYM-jd5snrK4dnp7L2xcLb3JivKwsVXCtLGkNbjXu6DQFtlbzEyVknv9j7GBJgOTvsE_lBqmQaFIdNrYiOf6bH0xAfelgNy_7db77zvSPfvrH9afb5DB_pTl-Q");
    getRequest.setCustomerProfileId(customerProfileId);
    getRequest.setCustomerPaymentProfileId(customerPaymentProfileId);
    getRequest.setMerchantAuthentication(merchantAuthenticationType);
	//pretty print request
	//console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	 var ctrl = new ApiControllers.GetCustomerPaymentProfileNonceController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		var response = new ApiContracts.GetCustomerPaymentProfileNonceResponse(apiResponse);

		//pretty print response
		// console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				//console.log('Result Code:'+response.getMessages().getResultCode());
				console.log('Data Descriptor:'+response.opaqueData.dataDescriptor);
				console.log('DataValue:'+response.opaqueData.dataValue);
				console.log('Expiration timestamp:'+response.opaqueData.expirationTimeStamp);
			
			}
			else
			{
				//console.log('Result Code: ' + response.getMessages().getResultCode());
				console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
				console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
			}
		}
		else
		{
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	getCustomerPaymentProfileNonce('1504802749', '1504102965', function(){
		console.log('getCustomerPaymentProfile call complete.');
	});
}

module.exports.getCustomerPaymentProfileNonce = getCustomerPaymentProfileNonce;