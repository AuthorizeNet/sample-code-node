'use strict';

module.exports = {
    authorizationAndCaptureContinue: require('./authorization-and-capture-continue.js').authorizationAndCaptureContinue,
    authorizationAndCapture: require('./authorization-and-capture.js').authorizationAndCapture,
    authorizationOnlyContinued: require('./authorization-only-continued.js').authorizationOnlyContinued,
    authorizationOnly: require('./authorization-only.js').authorizationOnly,
    credit: require('./credit.js').credit,
    getDetails: require('./get-details.js').getDetails,
    priorAuthorizationCapture: require('./prior-authorization-capture.js').priorAuthorizationCapture,
    paypalVoid: require('./void.js').paypalVoid
};