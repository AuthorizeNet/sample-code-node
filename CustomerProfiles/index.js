'use strict';

module.exports = {
	createCustomerPaymentProfile: require('./create-customer-payment-profile.js').createCustomerPaymentProfile,
	createCustomerProfile: require('./create-customer-profile.js').createCustomerProfile,
	createCustomerShippingAddress: require('./create-customer-shipping-address.js').createCustomerShippingAddress,
	deleteCustomerPaymentProfile: require('./delete-customer-payment-profile.js').deleteCustomerPaymentProfile,
	deleteCustomerProfile: require('./delete-customer-profile.js').deleteCustomerProfile,
	deleteCustomerShippingAddress: require('./delete-customer-shipping-address.js').deleteCustomerShippingAddress,
	getCustomerPaymentProfile: require('./get-customer-payment-profile.js').getCustomerPaymentProfile,
	getCustomerProfileIds: require('./get-customer-profile-ids.js').getCustomerProfileIds,
	getCustomerProfile: require('./get-customer-profile.js').getCustomerProfile,
	getCustomerShippingAddress: require('./get-customer-shipping-address.js').getCustomerShippingAddress,
	updateCustomerPaymentProfile: require('./update-customer-payment-profile.js').updateCustomerPaymentProfile,
	updateCustomerProfile: require('./update-customer-profile.js').updateCustomerProfile,
	updateCustomerShippingAddress: require('./update-customer-shipping-address.js').updateCustomerShippingAddress,
	validateCustomerPaymentProfile: require('./validate-customer-payment-profile.js').validateCustomerPaymentProfile,
	createCustomerProfileFromTransaction: require('./create-customer-profile-from-transaction.js').createCustomerProfileFromTransaction
};