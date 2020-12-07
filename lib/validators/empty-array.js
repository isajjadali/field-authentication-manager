const {
    forEach,
} = require('lodash');

/**
 * Validate that an array should be allowed as empty or not in request.
 * @module RegexValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.emptyArrayValidator = (required, request) => {
    let error;
    forEach(required, (value, key) => {
        if (value.avoidEmptyArray && Array.isArray(request[key]) && !request[key].length) {
            error = {
                [key]: value.errorMessage || 'Should not be an empty array',
            };
            return false;
        }
        return true;
    });
    return error;
};
