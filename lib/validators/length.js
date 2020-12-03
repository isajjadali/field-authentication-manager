const {
    forEach,
    has,
} = require('lodash');

const {
    DataTypes,
} = require(`${global.famConfig}/enums`);

/**
 * Validate maxLength, minLength and Exact length of value in request.
 * @module LengthValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.lengthValidator = (required = {}, request = {}) => {
    let error;
    forEach(required, (value, key) => {
        if (!Array.isArray(value) && typeof value === DataTypes.Object) {
            if (has(value, 'length')) {
                if (request[key].length !== value.length) {
                    error = {
                        [key]: `Length of ${key} should be ${value.length}`,
                    };
                    return false;
                }
            } else {
                if (has(value, 'maxLength')) {
                    if (request[key].length > value.maxLength) {
                        error = {
                            [key]: `Length of ${key} should not be greater than ${value.maxLength}`,
                        };
                        return false;
                    }
                }
                if (has(value, 'minLength')) {
                    if (request[key].length < value.minLength) {
                        error = {
                            [key]: `Length of ${key} should be greater than ${value.minLength}`,
                        };
                        return false;
                    }
                }
            }
        }
        return true;
    });
    return error;
};
