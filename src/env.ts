export const getENV = (name: string, defaultValue: string): string => {
  const value = process.env[name] || defaultValue;

  if (typeof value === 'undefined') {
    throw new Error(`Missing environment varialbe '${name}'`);
  }

  return value;
};
