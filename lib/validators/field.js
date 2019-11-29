const { errorMaker, getMissingKeys } = require(`${global.famLib}/helper`);

/**
 * Validate a request having all keys that are required.
 * @module RequiredFieldsValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {string} String if error exist, else returns false
 */
module.exports.requiredFieldsValidator = (required = {}, request = {}) => errorMaker(getMissingKeys(required, request));
