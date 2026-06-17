const PERSIAN_DIGITS = ['\u06f0', '\u06f1', '\u06f2', '\u06f3', '\u06f4', '\u06f5', '\u06f6', '\u06f7', '\u06f8', '\u06f9'];
const ARABIC_DIGITS = ['\u0660', '\u0661', '\u0662', '\u0663', '\u0664', '\u0665', '\u0666', '\u0667', '\u0668', '\u0669'];

export const toEnglishDigits = (value: string) =>
  value
    .replace(/[\u06f0-\u06f9]/g, (char) => String(PERSIAN_DIGITS.indexOf(char)))
    .replace(/[\u0660-\u0669]/g, (char) => String(ARABIC_DIGITS.indexOf(char)));

export const toPersianDigits = (value: string | number) =>
  String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[Number(digit)] ?? digit);

export const localizeDigits = (value: string | number, language: 'fa' | 'en') =>
  language === 'fa' ? toPersianDigits(value) : String(value);

export const formatCountdown = (seconds: number, language: 'fa' | 'en') => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const value = `${minutes}:${String(remainingSeconds).padStart(2, '0')}`;
  return localizeDigits(value, language);
};
