const {
    keys,
} = require('lodash');

const {
    DataTypes,
    BooleanValues,
} = require(`${global.famConfig}/enums`);


/**
 * Parse Query and convert stings(with numeric value) into number.
 * @module ParseQuery
 * @param {object} object={} normally used the query object
 * @return {object} parsed object
 */
module.exports.parseQuery = (object) => {
    const tempObject = object;
    keys(tempObject).forEach((key) => {
        if ((typeof tempObject[key]) === DataTypes.string) {
            const value = +tempObject[key];
            if (!Number.isNaN(value)) {
                tempObject[key] = value;
            } else if (Object.values(BooleanValues).indexOf(tempObject[key]) !== -1) {
                tempObject[key] = (tempObject[key] === BooleanValues.true);
            }
        }
    });
    return tempObject;
};
