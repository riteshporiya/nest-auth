export const toNumber = (
  value: any,
  option?: { default?: number; min?: number; max?: number },
) => {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const num = Number(value);
    if (Number.isNaN(num)) {
      return option?.default ?? NaN;
    }
    if (option?.min !== undefined && num < option.min) {
      return option.min;
    }
    if (option?.max !== undefined && num > option.max) {
      return option.max;
    }
    return num;
  }
  return option?.default ?? NaN;
};

export const toBoolean = (value: any) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value === 1;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true';
  }
  return false;
};
