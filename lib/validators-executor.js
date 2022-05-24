const {
    omit,
    difference,
    keys,
    chain,
    isEmpty,
    map,
    isArray,
    compact,
    cloneDeep,
} = require('lodash');

const {
    RequestBox,
} = require(`${global.famConfig}/enums`);

/**
 * Filter Keys which are common in both objects.
 * @constructor
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object with common keys in both objects
 */
function filterExtraAttributesFromObject(required = {}, request = {}) {
    return omit(request, difference(keys(request), keys(required)));
}

/**
 * Filter required Validators from RegisteredValidators, that would be required to validate a Request.
 * @constructor
 * @param {object} requiredFields={} Object of Required field.
 * @return {array} Validators required to validate a Request.
 */
function filterAlreadyRegisteredValidators(requiredFields = {}) {
    const stringifyRequiredFields = JSON.stringify(requiredFields);
    return chain(global.RegisteredValidators).map((validator) => {
        if (!validator.triggers || validator.triggers.some(validation => stringifyRequiredFields.indexOf(`"${validation}"`) !== -1)) {
            return validator;
        }
        return false;
    }).compact().value();
}

/**
 * Execute every required validator on request to validate.
 * @module ValidatorsExecutor
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @return {object} Object if error exist, else Returns false
 */
module.exports.validatorsExecutor = (required = {}, request = {}) => {
    const validators = filterAlreadyRegisteredValidators(required);

    let requiredBody = required.body;
    let requiredQuery = required.query;

    const requestBody = filterExtraAttributesFromObject(requiredBody, request.body);
    const requestQuery = filterExtraAttributesFromObject(requiredQuery, request.query);


    let isErrorFound = false;
    const errors = chain(RequestBox)
        .values()
        .map(boxType => compact(map(validators, (validator) => {
            if (!['isOptional'].includes(triggerValue => (validator.triggers || []).includes(triggerValue))) {
                requiredBody = cloneDeep(requiredBody);
                requiredQuery = cloneDeep(requiredQuery);
            }

            if (!isErrorFound) {
                if (boxType === RequestBox.body) {
                    const error = validator.func(requiredBody, requestBody, RequestBox.body);
                    if (error) {
                        isErrorFound = true;
                        return {
                            error,
                            requestBox: RequestBox.body,
                        };
                    }
                } else {
                    const error = validator.func(requiredQuery, requestQuery, RequestBox.query);
                    if (error) {
                        isErrorFound = true;
                        return {
                            error,
                            requestBox: RequestBox.query,
                        };
                    }
                }
            }
            return false;
        })))
        .filter(array => !isEmpty(array))
        .head()
        .value();

    return isArray(errors) && errors[0];
};
