import { isArray, isObject } from 'rxjs/internal-compatibility';

export function parseToPayload<T>(data: T): T {
  Object.keys(data).forEach(key => {
    if (data[key] === '') {
      data[key] = null;
    }
  });
  return data;
}

export function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toCamel(s) {
  return s.replace(/([-_][a-z])/ig, ($1) => {
    return $1.toUpperCase()
      .replace('-', '')
      .replace('_', '');
  });
}

export function toUnderScore(s) {
  return s.replace(/(?:^|\.?)([A-Z])/g, (x, y) => {
    return '_' + y.toLowerCase();
  }).replace(/^_/, '');
}

export function keysToCamel(obj: any) {
  if (isObject(obj)) {
    const n = {};
    Object.keys(obj)
      .forEach((key) => {
        n[toCamel(key)] = keysToCamel(obj[key]);
      });
    return n;
  }
  return obj;
}

export function associateArrayToArray(obj: any) {
  return Object.keys(obj).map(key => {
    if (isObject(obj[key]) && obj[key]) {
      Object.keys(obj[key]).forEach(subKey => {
        if (isObject(obj[key][subKey]) && obj[key][subKey]) {
          obj[key][subKey] = associateArrayToArray(obj[key][subKey]);
        }
      });
    }
    return obj[key];
  });
}

export function keysToUnderScore(o: any) {
  if (isObject(o)) {
    const n = {};
    Object.keys(o)
      .forEach((k) => {
        n[toUnderScore(k)] = keysToUnderScore(o[k]);
      });
    return n;
  } else if (isArray(o)) {
    return o.map((i) => {
      return keysToUnderScore(i);
    });
  }
  return o;
}
