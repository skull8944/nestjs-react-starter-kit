declare global {
  interface String {
    isNumeric(this: string): boolean;
  }
}

export const isNumeric = (value: string): boolean => {
  return /^-?\d+(\.\d+)?$/.test(value.trim());
};

if (!String.prototype.isNumeric) {
  String.prototype.isNumeric = function () {
    return isNumeric(this);
  };
}
