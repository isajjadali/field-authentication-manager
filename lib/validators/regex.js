const {
    forEach,
} = require('lodash');

const { regexValidator } = require(`${global.famLib}/helper`);

/**
 * Validate value in request according to required regex pattern.
 * @module RegexValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.regexValidator = (required, request) => {
    let error;
    forEach(required, (value, key) => {
        if (value.regex) {
            if (!regexValidator(value.regex, request[key])) {
                error = {
                    [key]: value.errorMessage || 'REGEX:: Not matched!',
                };
                return false;
            }
        }
        return true;
    });
    return error;
};
