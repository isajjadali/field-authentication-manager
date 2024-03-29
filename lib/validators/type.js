const { keys, isArray, isEmpty, chain, values, map } = require('lodash');

const { DataTypes, TypesOfObject } = require(`${global.famConfig}/enums`);

const {
  sortObject,
  filterValuesHavingEmptyString,
  ordinalSuffixOf,
} = require(`${global.famLib}/helper`);

/**
 * Validate a key have same value as per given requirements.
 * @module TypeValidator
 * @param {object} required={} Object of required fields
 * @param {object} request={} Object of request fields
 * @param {string} requestBox='' Request box, e.g: (body, query)
 * @return {string} Object if error exist, else returns false
 */
module.exports.TypeValidator = (
  required = {},
  request = {},
  requestBox = ''
) => {
  const requiredObject = sortObject(required);
  const requestObject = sortObject(request);
  const requiredObjectKeys = keys(requiredObject);
  const requiredObjectValues = map(requiredObject, obj => obj);
  const requestObjectValues = values(requestObject);

  return chain(requestObjectValues)
    .map(value => (isArray(value) ? DataTypes.array : typeof value))
    .map((type, index) => {
      const fieldName = requiredObjectKeys[index];
      const typeShouldBe = requiredObjectValues[index].type;
      const valueForNestedObject = requiredObjectValues[index].value;
      const valueOfField = requestObjectValues[index];
      const isObjectType = TypesOfObject.indexOf(type) !== -1;

      if (typeShouldBe !== type) {
        return `TYPE:: Type of ${fieldName} should be ${
          (TypesOfObject.indexOf(typeof typeShouldBe) !== -1 &&
            (isArray(typeShouldBe) ? DataTypes.array : typeof typeShouldBe)) ||
          typeShouldBe
        }!`;
      }

      if (isObjectType) {
        if (typeShouldBe === 'array') {
          // if required type is array
          if (isEmpty(valueForNestedObject)) {
            return '';
          }
          const {
            validatorsExecutor,
          } = require(`${global.famLib}/validators-executor`);
          let internalError;

          for (
            let $index = 0;
            $index <
            (valueOfField.length ? valueOfField.length : typeShouldBe.length);
            $index += 1
          ) {
            internalError = validatorsExecutor(
              {
                [requestBox]: valueForNestedObject,
              },
              {
                [requestBox]: filterValuesHavingEmptyString(
                  valueOfField[$index]
                ),
              }
            );

            if (internalError) {
              internalError = {
                [fieldName]: [internalError.error],
                ErrorOccuredAt: `${ordinalSuffixOf($index + 1)} Index`,
              };
              break;
            }
          }
          return internalError;
        }
        if (typeShouldBe === 'object') {
          // if required type is object
          const {
            validatorsExecutor,
          } = require(`${global.famLib}/validators-executor`);
          let nestedObjectError = '';
          nestedObjectError = validatorsExecutor(
            {
              [requestBox]: valueForNestedObject,
            },
            {
              [requestBox]: filterValuesHavingEmptyString(valueOfField),
            }
          );

          if (nestedObjectError) {
            return {
              [fieldName]: nestedObjectError.error,
            };
          }
        }
      }

      return '';
    })
    .compact()
    .take(1)
    .value()[0];
};
