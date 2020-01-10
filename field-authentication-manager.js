
/** @global */
global.famRoot = __dirname;
/** @global */
global.famLib = `${global.famRoot}/lib`;
/** @global */
global.famConfig = `${global.famRoot}/config`;


const { filterValuesHavingEmptyString, removeExtraKeys } = require(`${global.famLib}/helper`);
const { parseQuery } = require(`${global.famLib}/query-parser`);
const { validatorsExecutor } = require(`${global.famLib}/validators-executor`);
const { requiredFieldScrapper } = require(`${global.famLib}/field-scrapper`);
const { cloneDeep } = require('lodash');


/**
 * Validate the Request Body and Query as per requirements.
 * @constructor
 * @param {object} config
 * @param {object} config.req={} Current request to be validate
 * @param {string} config.mounthPath='/api/' Mount path of url from where url starts
 * @return {object} Object if error exist, else Returns false
 */
function fieldAuthenticatorsRunner({ req = {}, mountPath = '/api/' } = {}) {
    let { url, method } = req;

    let requiredObject = requiredFieldScrapper({
        url,
        mountPath,
        method: method.toLowerCase(),
    });

    if (requiredObject) {
        requiredObject = cloneDeep(requiredObject);
        req.body = removeExtraKeys(requiredObject.body, req.body);
        req.query = removeExtraKeys(requiredObject.query, req.query);

        const error = validatorsExecutor(requiredObject, {
            body: filterValuesHavingEmptyString(req.body),
            query: parseQuery(filterValuesHavingEmptyString(req.query)),
        });

        if (error) {
            return {
                [error.requestBox]: error.error,
            };
        }
    }
    return false;
}

/**
 * Set up configrations and return fieldAuthenticatorsRunner function.
 * @module FieldAuthenticationManager
 * @param {object} config
 * @param {string} config.requiredFieldDirectoryPath='./controllers' Directory path of required fields controllers
 * @return {function} Function to validate the request
 */
module.exports = function fieldAuthenticationManager({ requiredFieldDirectoryPath = 'controllers' }) {
    /** @global */
    global.RequiredFields = require(`${global.famLib}/required-field-json-maker`)(`${process.cwd()}/${requiredFieldDirectoryPath}`);
    /** @global */
    global.RegisteredValidators = require(`${global.famLib}/validators-registrator`)(global.RequiredFields);

    return fieldAuthenticatorsRunner;
};
