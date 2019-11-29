const {
    forEach,
} = require('lodash');

/**
 * Map default value of a value if given in requirements.
 * @module DefaultValueMapper
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 */
module.exports.defaultValueMapper = (required = {}, request = {}) => {
    forEach(required, (value, key) => {
        if (value.default) {
            if (!request[key]) {
                request[key] = value.default;
                return false;
            }
        }
        return true;
    });
};
