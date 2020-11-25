import { stringify } from 'javascript-stringify';

export function shouldShortenFunction(value: any, verbose: boolean) {
  return typeof value === 'function' && !verbose && value.toString().length > 100;
}

export function toString(config: any, options?: { verbose: boolean }) {
  const verbose = options?.verbose ?? false;
  return stringify(config, (value, _indent, next) => {
    if (shouldShortenFunction(value, verbose)) {
      return `function () { /* omitted long function */ }`;
    }
    return next(value);
  });
}
