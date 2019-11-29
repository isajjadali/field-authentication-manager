/**
* Enums used in whole app.
* @module Enums
* @return {object} Object with enums as keys
*/

module.exports.DataTypes = {
    string: 'string',
    number: 'number',
    array: 'array',
    object: 'object',
};

module.exports.TypesOfObject = [
    this.DataTypes.object,
    this.DataTypes.array,
];

module.exports.Substrings = {
    inBody: 'in body',
    inQuery: 'in query',
};

module.exports.RequestBox = {
    body: 'body',
    query: 'query',
};

module.exports.BooleanValues = {
    true: 'true',
    flase: 'false',
};
