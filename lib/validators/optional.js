const { removeOptionalKeys } = require(`${global.famLib}/helper`);

/**
 * Remove all optional Keys if not exist in upcoming request.
 * @module RemoveOptionalKeysIfNotExistInRequest
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {string} String if error exist, else returns false
 */
module.exports.removeOptionalKeysIfNotExistInRequest = (required = {}, request = {}) => removeOptionalKeys(required, request);
