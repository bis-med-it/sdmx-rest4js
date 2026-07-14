import { ReportingPeriodType } from './sdmx-patterns';

const validEnum = (
  input: any,
  list: { [key: string]: any },
  name: string,
  errors: string[],
): boolean => {
  const found = Object.values(list).some((v) => v === input);
  if (!found) {
    errors.push(
      `${input} is not in the list of supported ${name} ` +
        `(${Object.values(list)})`,
    );
  }
  return found;
};

const validMultipleEnum = (
  input: any,
  list: { [key: string]: any },
  name: string,
  errors: string[],
): boolean => {
  if (input && input.indexOf('+') > -1) {
    const output = input
      .split('+')
      .map((r: any) => validEnum(r, list, name, errors));
    return output.indexOf(false) === -1;
  } else if (input && input.indexOf(',') > -1) {
    const output = input
      .split(',')
      .map((r: any) => validEnum(r, list, name, errors));
    return output.indexOf(false) === -1;
  } else {
    return validEnum(input, list, name, errors);
  }
};

const validPattern = (
  input: any,
  regex: RegExp,
  name: string,
  errors: string[],
): any => {
  const valid = input && input.match(regex);
  if (!valid) {
    errors.push(
      `${input} is not compliant with the pattern defined for ` +
        `${name} (${regex})`,
    );
  }
  return valid;
};

const createErrorMessage = (errors: string[], type: string): string => {
  let msg = `Not a valid ${type}: \n`;
  for (const error of errors) {
    msg += `- ${error} \n`;
  }
  return msg;
};

const validIso8601 = (input: any, name: string, errors: string[]): boolean => {
  let valid = true;
  if (isNaN(Date.parse(input))) {
    errors.push(`${name} must be a valid ISO8601 date`);
    valid = false;
  }
  return valid;
};

const validPeriod = (input: any, name: string, errors: string[]): any => {
  let valid =
    validIso8601(input, name, errors) ||
    validPattern(input, ReportingPeriodType, name, errors);
  if (!valid) {
    errors.push(`${name} must be a valid SDMX period or a valid ISO8601 date`);
    valid = false;
  }
  return valid;
};

export {
  validEnum as isValidEnum,
  validMultipleEnum as isValidMultipleEnum,
  validPattern as isValidPattern,
  createErrorMessage,
  validIso8601 as isValidDate,
  validPeriod as isValidPeriod,
};
