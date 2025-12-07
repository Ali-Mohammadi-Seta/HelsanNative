export const nationalIdValidator = (input: string): boolean => {
  // The input must have exactly 10 digits.
  const re = /^\d{10}$/;
  return re.test(input);
};
