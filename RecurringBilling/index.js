'use strict';

module.exports = {
	cancelSubscription: require('./cancel-subscription.js').cancelSubscription,
	createSubscriptionFromCustomerProfile: require('./create-subscription-from-customer-profile.js').createSubscriptionFromCustomerProfile,
	createSubscription: require('./create-subscription.js').createSubscription,
	getListOfSubscription: require('./get-list-of-subscription.js').getListOfSubscription,
	getSubscriptionStatus: require('./get-subscription-status.js').getSubscriptionStatus,
	getSubscription: require('./get-subscription.js').getSubscription,
	updateSubscription: require('./update-subscription.js').updateSubscription
};
