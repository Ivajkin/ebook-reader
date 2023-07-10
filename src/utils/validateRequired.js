/**
 * Function for validating required fields.
 * Returns a dictionary with the same keys as in fields and boolean values.
 *
 * If the unfilled flag is false, validation will be successful
 * for every field with required = 0 or required = 1 and for
 * every non-empty field with required = 2.
 *
 * If the unfilled flas is true, validation will be successful
 * for every field with required = 0  and for
 * every non-empty field with required = 2 or required = 1.
 *
 * If extra_validations has a key equal to some field name, the corresponding
 * function will be applied to corresponding field as well
 *
 * @param {{}} fields - values of fields
 * @param {{}} fields_descriptions - fields descriptions
 *
 * @param {boolean} unfilled - flag representing chosen mode
 *
 * @param {{}} extraValidations - additional validating functions
 *
 * @return {{}} - fields validation dict
 */

const validateFields = (fields, fields_descriptions, unfilled, extraValidations = {}) => {
  /**
   *
   * Function validating single field
   * @param {string} field_name - name of the field
   *
   * @return {boolean}
   */
  const validateFieldFunc = field_name => {
    //console.log('#S6', field_name, fields[field_name]);
    let requiredValidation = validateRequiredFieldFunc(field_name);
    let extraValidationsResult = extraValidations[field_name]
      ? extraValidations[field_name](fields[field_name])
      : true;

    return requiredValidation && extraValidationsResult;
  };

  /**
   *
   * Function validating single field (without extra functions)
   * @param {string} field_name - name of the field
   *
   * @return {boolean}
   */
  const validateRequiredFieldFunc = field_name => {
    //console.log('#KK7', fields_descriptions[field_name].type);
    if (
      fields_descriptions[field_name].required === 0 ||
      fields_descriptions[field_name].type === 'page' ||
      fields_descriptions[field_name].type === 'checkbox' ||
      fields_descriptions[field_name].type === 'radiobutton' ||
      fields_descriptions[field_name].type === 'images'
    ) {
      return true;
    } else {
      let isEmpty;
      if (fields[field_name] === null || fields[field_name] === undefined) {
        isEmpty = true;
      } else if (fields[field_name].hasOwnProperty('forSend')) {
        isEmpty = fields[field_name].forSend.length === 0;
      } else if (typeof fields[field_name] === 'boolean') {
        isEmpty = false;
      } else {
        isEmpty = String(fields[field_name]).length === 0;
      }

      if (fields_descriptions[field_name].required === 1) {
        return !unfilled || !isEmpty;
      } else {
        return !isEmpty;
      }
    }
  };

  let result = {};

  //console.log('#H1', fields);
  if (fields_descriptions) {
    Object.keys(fields_descriptions).forEach(name => {
      result[name] = validateFieldFunc(name);
    });
  }

  return result;
};

export default validateFields;
