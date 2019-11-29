
/** @global */
global.famRoot = __dirname;
/** @global */
global.famLib = `${global.famRoot}/lib`;
/** @global */
global.famConfig = `${global.famRoot}/config`;


const { filterValuesHavingEmptyString } = require(`${global.famLib}/helper`);
const { parseQuery } = require(`${global.famLib}/query-parser`);
const { validatorsExecutor } = require(`${global.famLib}/validators-executor`);
const { requiredFieldScrapper } = require(`${global.famLib}/field-scrapper`);


/**
 * Validate the Request Body and Query as per requirements.
 * @constructor
 * @param {object} config
 * @param {object} config.req={} Current request to be validate
 * @param {string} config.mounthPath='/api/' Mount path of url from where url starts
 * @return {object} Object if error exist, else Returns false
 */
function fieldAuthenticatorsRunner({ req = {}, mountPath = '/api/' }) {
    const {
        url, method, body, query,
    } = req;

    const requiredObject = requiredFieldScrapper({
        url,
        mountPath,
        method: method.toLowerCase(),
    });

    if (requiredObject) {
        const error = validatorsExecutor(requiredObject, {
            body: filterValuesHavingEmptyString(body),
            query: parseQuery(filterValuesHavingEmptyString(query)),
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
