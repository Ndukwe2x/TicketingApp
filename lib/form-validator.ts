export function validateForm(form: HTMLFormElement, validationRules: Record<string, any>) {
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

interface ValidationMessageProps extends Record<string, any> {
    required: string,
    min: string,
    max: string,
    between: string
}

function handleValidation(form: FormData, validationRules: Record<string, any>) {
    const validationMessages: ValidationMessageProps = {
        required: '%field% is required',
        min: '%field% can not be less than %min%.',
        max: '%field% can not be more than %max%',
        between: '%field% must be between %min% and %max%',
    }

    let errors: Record<string, any> = {};

    for (const [field, validationRule] of Object.entries(validationRules)) {
        const rules: string[] = validationRule.split('|');

        for (const rule of rules) {
            let ruleArr: string[] = [];

            if (rule.indexOf('=') >= 0) {
                ruleArr = rule.split('=')
            } else if (rule.indexOf(':') >= 0) {
                ruleArr = rule.split(':')
            } else {
                ruleArr.unshift(rule);
            }

            const ruleName = ruleArr[0];

            if (!Object.hasOwn(validationMessages, ruleName)) {
                throw new Error(`Invalid validation rule name: '${ruleName}'`);
            }
            let message: string = validationMessages[ruleName] || '';
            message = message.length ? message.replaceAll('%field%', field) : message;

            switch (ruleName) {
                case 'required':
                    if (ruleArr.length > 1) {
                        message = <string>[...ruleArr].pop();
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
                    const [_$, min, minErr] = ruleArr as [string, number, string];
                    if (minErr) {
                        message = minErr
                    }
                    message?.replace('%min%', min.toString());

                    const minValue = form.get(field) ?? '';
                    if (minValue.toString().length < min) {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['min'] = message;
                        return errors;
                    }
                    break;
                case 'max':
                    const [, max, maxErr] = ruleArr as [string, number, string];
                    if (maxErr) {
                        message = maxErr
                    }
                    message?.replace('%max%', max.toString());
                    const maxValue = form.get(field) || '';
                    if (maxValue.toString().length > max) {
                        if (!Object.hasOwn(errors, field)) {
                            errors[field] = {};
                        }
                        errors[field]['max'] = message;
                        return errors;
                    }
                    break;
                case 'between':
                    const [minVal, maxVal, errBetween] = ruleArr[1].split(':') as [number, number, string];
                    if (errBetween) {
                        message = errBetween;
                    }
                    message?.replace('%min%', minVal.toString()).replace('%max%', maxVal.toString());
                    const valBetween = form.get(field) || '';
                    if (valBetween.toString().length < minVal || valBetween.toString().length > maxVal) {
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