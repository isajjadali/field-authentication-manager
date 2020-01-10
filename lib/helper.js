// NOTE: Don't Use `global.` in this file as this file also use before server start

const {
    keys,
    fromPairs,
    map,
    sortBy,
    omitBy,
    difference,
    pick,
} = require('lodash');
const path = require('path');

const { EmailValidator } = require('../config/regex');

/**
 * Append ordinal suffix of number.
 * @constructor
 * @param {number} number=0 number should not be a string
 * @return {string} Number by ordinal appendix suffix with it
 */
function ordinalSuffixOf(number = 0) {
    const modeOfNumberByTen = number % 10;
    const modeOfNumberByHundreds = number % 100;
    if (modeOfNumberByTen === 1 && modeOfNumberByHundreds !== 11) {
        return `${number}st`;
    }
    if (modeOfNumberByTen === 2 && modeOfNumberByHundreds !== 12) {
        return `${number}nd`;
    }
    if (modeOfNumberByTen === 3 && modeOfNumberByHundreds !== 13) {
        return `${number}rd`;
    }
    return `${number}th`;
}

/**
 * Sort incomming object.
 * @constructor
 * @param {object} object={} Object of required fields
 * @return {object} Sorted object.
 */
function sortObject(object = {}) {
    return fromPairs(map(sortBy(keys(object)), key => [key, object[key]]));
}

/**
 * Filter Keys that are comming empty as value.
 * @constructor
 * @param {object} object={} Object that may contains empty strings as value of a key
 * @return {object} Object after omiting keys with empty string as value
 */
function filterValuesHavingEmptyString(object = {}) {
    return omitBy(object, (value, key) => object[key] === '');
}

/**
 * Filter keys that are required but not in request.
 * @constructor
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {array} Array of keys, not exist in request but in required
 */
function getMissingKeys(required = {}, request = {}) {
    return difference(keys(required), keys(request));
}

/**
 * Remove all validators if optional keys are not in request
 * @constructor
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {array} Array of filtered keys
 */
function removeOptionalKeys(required = {}, request = {}) {
    return keys(required).forEach(key => required[key].isOptional && !request[key] && delete required[key]);
}

/**
 * Remove all extra keys except those which are mentioned
 * @constructor
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {Object} request={}
 */
function removeExtraKeys(required = {}, request = {}) {
    if (required.allowableKeys) {
        request = pick(request, [...keys(required), ...required.allowableKeys]);
        delete required.allowableKeys;
        return request;
    }
    return request;
}

/**
 * Make a appropriate error according to given array of fields.
 * @constructor
 * @param {array} fields=[] Array of missing fields
 * @return {string} Error string in two ways, e.g:
 * - item, item1 are required
 * - item is required
 */
function errorMaker(fields = []) {
    return (fields.length && `${fields.join(', ')} ${(fields.length > 1 && 'are required') || 'is required'}`) || '';
}

/**
 * Validate the value as per given regex pattern.
 * @constructor
 * @param {object} regex Regex to be tested
 * @param {object} value Value to be tested on given regex
 * @return {boolean} True if value is according to the regex pattern, else false
 */
function regexValidator(regex, value) {
    return regex.test(String(value).toLowerCase());
}

/**
 * Filter Keys which are common in both objects.
 * @constructor
 * @param {string} email='' String that should be an email type
 * @return {boolean} True if email is valid, else false
 */
function emailValidator(email = '') {
    return EmailValidator.test(String(email).toLowerCase());
}

/**
 * Resolve base path and make absolute path.
 * @constructor
 * @param {string} basePath='' Path of specific folder or file
 * @return {string} Resolved path started from current project directory
 */
function getAbsolutePath(basePath = '') {
    return path.resolve(path.join('./', basePath));
}

/**
 * Provide helper functions.
 * @module Helper
 * @return {object} Object with helper functions as keys
 */
module.exports = {
    ordinalSuffixOf,
    sortObject,
    filterValuesHavingEmptyString,
    getMissingKeys,
    errorMaker,
    regexValidator,
    emailValidator,
    getAbsolutePath,
    removeExtraKeys,
    removeOptionalKeys,
};
