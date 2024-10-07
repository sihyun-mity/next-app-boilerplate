export const isValidQuery = (value: any): boolean =>
  value !== undefined && value !== null && value !== 'undefined' && value !== 'null' && value.length > 0;

export const isIncludedInQuery = (query: string | string[] | undefined, value: string): boolean => {
  if (Array.isArray(query)) {
    return query.includes(value);
  }
  if (query) {
    return query == value;
  }
  return false;
};

export const addToQuery = (prevValue: string | string[] | undefined, newValue: string): string | string[] => {
  if (Array.isArray(prevValue)) {
    return [...prevValue, newValue];
  }
  if (prevValue) {
    return [prevValue, newValue];
  }
  return newValue;
};

export const removeFromQuery = (query: string | string[] | undefined, value: string): string | string[] | undefined => {
  if (Array.isArray(query)) {
    return query.filter((v) => v !== value);
  }
  if (query) {
    return query === value ? undefined : query;
  }
  return undefined;
};
