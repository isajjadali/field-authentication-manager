const ValidatorsPath = `${global.famLib}/validators`;

const Validators = [
    // {
    //     triggers: ['default'],
    //     path: `${ValidatorsPath}/default-value`,
    //     module: 'defaultValueMapper',
    // },
    {
        path: `${ValidatorsPath}/field`,
        module: 'requiredFieldsValidator',
    }, {
        triggers: ['type'],
        path: `${ValidatorsPath}/type`,
        module: 'TypeValidator',
    }, {
        triggers: ['length', 'maxLength', 'minLength'],
        path: `${ValidatorsPath}/length`,
        module: 'lengthValidator',
    }, {
        triggers: ['min', 'max'],
        path: `${ValidatorsPath}/limit`,
        module: 'limitValidator',
    }, {
        triggers: ['isEmail'],
        path: `${ValidatorsPath}/email`,
        module: 'emailValidator',
    }, {
        triggers: ['regex'],
        path: `${ValidatorsPath}/regex`,
        module: 'regexValidator',
    },
];


/**
 * Filter Validators that would be required to validate a Request.
 * @module ValidatorsRegistrator
 * @param {object} requiredFields={} Object of Required field.
 * @return {array} Validators required to validate a Request.
 */
module.exports = function validatorsRegistrator(requiredFields = {}) {
    const stringifyRequiredFields = JSON.stringify(requiredFields);

    const RegisteredValidators = [];

    Validators.forEach((validator) => {
        if (!validator.triggers || validator.triggers.some(validation => stringifyRequiredFields.indexOf(`"${validation}"`) !== -1)) {
            RegisteredValidators.push({
                triggers: validator.triggers,
                func: require(validator.path)[validator.module],
            });
        }
    });
    return RegisteredValidators;
};
