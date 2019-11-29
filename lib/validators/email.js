const {
    forEach,
} = require('lodash');

const { emailValidator } = require(`${global.famLib}/helper`);

/**
 * Validate that value is correct email or not.
 * @module EmailValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.emailValidator = (required = {}, request = {}) => {
    let error;
    forEach(required, (value, key) => {
        if (value.isEmail) {
            if (!emailValidator(request[key])) {
                error = {
                    [key]: 'Email is not valid',
                };
                return false;
            }
        }
        return true;
    });
    return error;
};
