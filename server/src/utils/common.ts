import lodash from 'lodash';

declare global {
  interface String {
    ltrim(target: string): string;
  }
}
const ltrim = (str: string, target: string): string => str.replace(new RegExp(`^${target}+`), '');
if (!String.prototype.ltrim) {
  String.prototype.ltrim = function (this: string, target: string): string {
    return ltrim(this, target);
  };
}

export const objKeyToCamelCase = <
  TReturn extends Record<string, unknown> = Record<string, unknown>,
  TObj extends Record<string, unknown> = Record<string, unknown>,
>(
  obj: TObj,
): TReturn =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    const camelCaseKey = lodash.camelCase(key);
    acc[camelCaseKey as keyof TReturn] = value as ValueOf<TReturn>;

    return acc;
  }, {} as TReturn);
