'use strict';

module.exports = {
	cancelSubscription: require('./cancel-subscription.js').cancelSubscription,
	createSubscriptionFromCustomerProfile: require('./create-subscription-from-customer-profile.js').createSubscriptionFromCustomerProfile,
	createSubscription: require('./create-subscription.js').createSubscription,
	getListOfSubscriptions: require('./get-list-of-subscriptions.js').getListOfSubscriptions,
	getSubscriptionStatus: require('./get-subscription-status.js').getSubscriptionStatus,
	getSubscription: require('./get-subscription.js').getSubscription,
	updateSubscription: require('./update-subscription.js').updateSubscription
};
