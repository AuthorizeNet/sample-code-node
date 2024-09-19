'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var constants = require('../constants.js');

function getAcceptCustomerProfilePage(customerProfileId, callback) {

	var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
	merchantAuthenticationType.setName(constants.apiLoginKey);
	merchantAuthenticationType.setTransactionKey(constants.transactionKey);
	
	var setting = new ApiContracts.SettingType();
	setting.setSettingName('hostedProfileReturnUrl');
	setting.setSettingValue('https://returnurl.com/return/');

	var settingList = [];
	settingList.push(setting);

	var alist = new ApiContracts.ArrayOfSetting();
	alist.setSetting(settingList);

	var getRequest = new ApiContracts.GetHostedProfilePageRequest();
	getRequest.setMerchantAuthentication(merchantAuthenticationType);
	getRequest.setCustomerProfileId(customerProfileId);
	getRequest.setHostedProfileSettings(alist);

	//console.log(JSON.stringify(getRequest.getJSON(), null, 2));
		
	var ctrl = new ApiControllers.GetHostedProfilePageController(getRequest.getJSON());

	ctrl.execute(function(){

		var apiResponse = ctrl.getResponse();

		if (apiResponse != null) var response = new ApiContracts.GetHostedProfilePageResponse(apiResponse);

		//pretty print response
		//console.log(JSON.stringify(response, null, 2));

		if(response != null) 
		{
			if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK)
			{
				console.log('Hosted profile page token :');
				console.log(response.getToken());
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
			var apiError = ctrl.getError();
			console.log(apiError);
			console.log('Null response received');
		}

		callback(response);
	});
}

if (require.main === module) {
	getHostedProfilePage('41003872', function(){
		console.log('getHostedProfilePage call complete.');
	});
}

module.exports.getHostedProfilePage = getHostedProfilePage;
