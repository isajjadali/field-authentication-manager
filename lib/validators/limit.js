const {
    forEach,
    has,
} = require('lodash');

/**
 * Validate max and min limit of value in request.
 * @module LimitValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.limitValidator = (required = {}, request = {}) => {
    let error;
    forEach(required, (value, key) => {
        if (has(value, 'max')) {
            if (request[key] > value.max) {
                error = {
                    [key]: `Value of ${key} should be less than ${value.max}`,
                };
                return false;
            }
        }
        if (has(value, 'min')) {
            if (request[key] < value.min) {
                error = {
                    [key]: `Value of ${key} should be greater than ${value.min}`,
                };
                return false;
            }
        }
        return true;
    });
    return error;
};
