// NOTE: Don't Use `global.` in this file as this file also use before server start
const fs = require('fs');

const { JsExtensionValidator } = require('../config/regex');
const { getAbsolutePath } = require('./helper');

/**
 * Combining all routes required fields JSON and Make a Single one.
 * @constructor
 * @param {object} config
 * @param {array} config.url='' Absolute Path of specific directory containg request's required field's JSON
 * @param {array} config.object={} Combined object of all request's required field's JSON
 * @return {object} Combined object of Required Fields for all possible request
 */
function getCombineJsonOfMultipleFiles({ path = '', object = {} }) {
    const currentObject = object;
    if (!fs.existsSync(path)) {
        return currentObject;
    }

    if (!fs.lstatSync(path).isDirectory()) {
        if (!JsExtensionValidator.test(path)) {
            return currentObject;
        }

        Object.assign(currentObject, require(path));
        return currentObject;
    }

    const dirItems = fs.readdirSync(path);
    dirItems.forEach((item) => {
        const nameWithoutExtension = item.replace(JsExtensionValidator, '');
        if (item !== 'index.js') {
            currentObject[nameWithoutExtension] = {};
        }
        return getCombineJsonOfMultipleFiles({
            path: `${path}/${item}`,
            object: currentObject[nameWithoutExtension] || currentObject,
        });
    });

    return currentObject;
}

/**
 * Set up configrations and return fieldAuthenticatorsRunner.
 * @module RequiredFieldsCombinedJsonMaker
 * @param {object} config
 * @param {string} config.basePath='' Base Directory path of required fields controllers
 * @return {object} Combined Object of Required Fields
 */
module.exports = basePath => getCombineJsonOfMultipleFiles({
    path: getAbsolutePath(basePath),
});
