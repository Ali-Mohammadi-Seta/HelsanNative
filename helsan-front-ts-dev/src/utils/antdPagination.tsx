import React from 'react';

const persianNumbers = '۰۱۲۳۴۵۶۷۸۹';

const latinNumbersList = [
  /0/g,
  /1/g,
  /2/g,
  /3/g,
  /4/g,
  /5/g,
  /6/g,
  /7/g,
  /8/g,
  /9/g,
];

export function convertNumberToLetter(num: number): string {
  let result = '';
  const str = num.toString();
  // Each character in the numeric string is a digit, so we convert it to a number
  for (const c of str) {
    result += persianNumbers.charAt(Number(c));
  }
  return result;
}

export function toPersianDigits(input: string | number): string {
  let str = String(input);
  for (let i = 0; i < 10; i++) {
    str = str.replace(latinNumbersList[i], persianNumbers.charAt(i));
  }
  return str;
}

// Assuming this is used for rendering pagination items (e.g., in Ant Design)
// Here we add type annotations for parameters and the return value.
export function itemRender(
  current: number,
  type: string,
  originalElement: React.ReactNode
): React.ReactNode {
  if (type === 'page') {
    return <a>{convertNumberToLetter(current)}</a>;
  }
  return originalElement;
}

// Separator formats a string by inserting a separator every `seperateLength` characters.
export const Separator = (
  input: string | number,
  seperater: string = ',',
  seperateLength: number = 3
): string => {
  input = input.toString();
  let result = '';
  let count = 0;
  for (let i = input.length - 1; i > -1; i--) {
    if (count === seperateLength) {
      result = seperater + result;
      count = 0;
    }
    result = input.charAt(i) + result;
    count++;
  }
  return result;
};
