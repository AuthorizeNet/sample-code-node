'use strict';

var ApiContracts = require('authorizenet').APIContracts;
var ApiControllers = require('authorizenet').APIControllers;
var utils = require('../utils.js');
var constants = require('../constants.js');

function getListOfSubscriptions(callback) {
    var merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    var refId = utils.getRandomInt();

    var sorting = new ApiContracts.ARBGetSubscriptionListSorting();
    sorting.setOrderDescending(true);
    sorting.setOrderBy(ApiContracts.ARBGetSubscriptionListOrderFieldEnum.CREATETIMESTAMPUTC);

    var paging = new ApiContracts.Paging();
    paging.setOffset(1);
    paging.setLimit(100);

    var listRequest = new ApiContracts.ARBGetSubscriptionListRequest();

    listRequest.setMerchantAuthentication(merchantAuthenticationType);

    listRequest.setRefId(refId);
    listRequest.setSearchType(ApiContracts.ARBGetSubscriptionListSearchTypeEnum.SUBSCRIPTIONACTIVE);
    listRequest.setSorting(sorting);
    listRequest.setPaging(paging);

    console.log(JSON.stringify(listRequest.getJSON(), null, 2));

    var ctrl = new ApiControllers.ARBGetSubscriptionListController(listRequest.getJSON());

    ctrl.execute(function(){
        var apiResponse = ctrl.getResponse();

        var response = new ApiContracts.ARBGetSubscriptionListResponse(apiResponse);

        console.log(JSON.stringify(response, null, 2));

        if(response != null){
            if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
                console.log('Total Results: ' + response.getTotalNumInResultSet());
                console.log('List of Subscription IDs: ');
                var subscriptions = response.getSubscriptionDetails().getSubscriptionDetail();
                for (var i=0;i<subscriptions.length;i++)
                {
                    console.log(subscriptions[i].getId());
                }
                console.log('Message Code: ' + response.getMessages().getMessage()[0].getCode());
                console.log('Message Text: ' + response.getMessages().getMessage()[0].getText());
            }
            else{
                console.log('Result Code: ' + response.getMessages().getResultCode());
                console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
                console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
            }
        }
        else{
            var apiError = ctrl.getError();
			console.log(apiError);
			console.log('Null Response.');
        }



        callback(response);
    });
}

if (require.main === module) {
    getListOfSubscriptions(function(){
        console.log('getListOfSubscriptions call complete.');
    });
}

module.exports.getListOfSubscriptions = getListOfSubscriptions;