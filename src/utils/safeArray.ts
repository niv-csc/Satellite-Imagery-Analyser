/**
 * Safe array utilities to prevent "undefined length" errors
 */

export const safeArray = <T,>(arr: T[] | null | undefined): T[] => {
  return Array.isArray(arr) ? arr : [];
};

export const safeLength = (arr: any[] | null | undefined): number => {
  return Array.isArray(arr) ? arr.length : 0;
};

export const safeGet = (obj: any, path: string, defaultValue: any = null): any => {
  try {
    const keys = path.split('.');
    let result = obj;
    for (const key of keys) {
      if (result === null || result === undefined) return defaultValue;
      result = result[key];
    }
    return result !== undefined ? result : defaultValue;
  } catch {
    return defaultValue;
  }
};
