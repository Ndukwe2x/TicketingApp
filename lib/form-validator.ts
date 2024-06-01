export const validateForm = function(form: HTMLFormElement, validationRules: {}) {
    const formData = new FormData(form);
    const errors = handleValidation(formData, validationRules);

    if (Object.keys(errors).length) {
        return {
            validated: false,
            errors: errors
        }
    }
    return {
        validated: formData
    }
}

function handleValidation(form: FormData, validationRules: {}) {
    const validationMessages: {
        required: string,
        min: string,
        max: string,
        between: string
    } = {
        'required': '%field% is required',
        'min': '%field% can not be less than %min%.',
        'max': '%field% can not be more than %max%',
        'between': '%field% must be between %min% and %max%',
    }
    
    let errors = {};

    for (const [field, validationRule] of Object.entries(validationRules)) {
        const rules = validationRule.split('|');
        
        for (let i = 0; i < rules.length; i++) {
            const ruleStr = rules[i];
            let ruleArr: string[] = [];
            
            if (ruleStr.indexOf('=') >= 0) {
                ruleArr = ruleStr.split('=')
            } else if (ruleStr.indexOf(':') >= 0) {
                ruleArr = ruleStr.split(':')
            } else {
                ruleArr.unshift(ruleStr);
            }

            const ruleName = ruleArr[0];

            if (!Object.hasOwn(validationMessages, ruleName)) {
                throw new Error(`Invalid validation rule name: '${ruleName}'`);
            }
            let message: string | undefined = validationMessages[ruleName];
            message = message?.replaceAll('%field%', field);
            
            switch (ruleName) {
                case 'required':
                    if (ruleArr.length > 1) {
                        message = [...ruleArr].pop();
                    }
                    
                    if (form.get(field) == '') {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['required'] = message;
                        return errors;
                    }
                    break;
                case 'min':
                    const [, min, minErr] = ruleArr;
                    if (minErr) {
                        message = minErr
                    }
                    message?.replace('%min%', min);
                    if (form.get(field)?.length < min) {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['min'] = message;
                        return errors;
                    }
                    break;
                case 'max':
                    const [, max, maxErr] = ruleArr;
                    if (maxErr) {
                        message = maxErr
                    }
                    message?.replace('%max%', max);
                    if (form.get(field)?.length > max) {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['max'] = message;
                        return errors;
                    }
                    break;
                case 'between':
                    const [minVal, maxVal, errBetween] = ruleArr[1].split(':');
                    if (errBetween) {
                        message = errBetween;
                    }
                    message?.replace('%min%', minVal).replace('%max%', maxVal);
                    const input = form.get(field);
                    if (input?.length < minVal || input?.length > maxVal) {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['between'] = message;
                        return errors;
                    }
                    break;
                default:
                    break;
            }
        }
    }
    
    return errors;
}