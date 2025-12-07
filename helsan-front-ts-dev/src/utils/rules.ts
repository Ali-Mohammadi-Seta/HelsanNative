import { toEnglishDigits } from "@/utils/toEnglishDigits";
import i18n from "@/i18n";
import type { RuleObject } from "rc-field-form/lib/interface";

// Validator function rule type
type ValidatorRule = () => {
  validator: (rule: RuleObject, value: string) => Promise<void>;
};

export const NationalIdRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.reject();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length !== 10) {
        return Promise.reject(i18n.t("rules.natCodeDigit"));
      }
      return Promise.resolve();
    },
  }),
];

export const ClinicAdminNationalIdRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.reject();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length !== 11) {
        return Promise.reject(i18n.t("rules.ClinicAdminNatCodeDigit"));
      }
      return Promise.resolve();
    },
  }),
];

export const mobileRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.reject();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length !== 11) {
        return Promise.reject(i18n.t("rules.phonNumDigit"));
      }
      return Promise.resolve();
    },
  }),
];

export const NationalIdRules2: RuleObject[] = [
  {
    type: "regexp",
    pattern: new RegExp(/\d+/g),
    message: i18n.t("rules.enterNumber"),
  },
  { len: 10, message: i18n.t("rules.natCodeDigit") },
];

export const phoneRules2: RuleObject[] = [
  {
    type: "regexp",
    pattern: new RegExp(/\d+/g),
    message: i18n.t("rules.enterNumber"),
  },
  { len: 11, message: i18n.t("rules.phonNumDigit") },
];

export const glnRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.reject();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length < 13) {
        return Promise.reject(i18n.t("rules.drugStoreDigit"));
      }
      return Promise.resolve();
    },
  }),
];

export const phoneRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.resolve();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      return Promise.resolve();
    },
  }),
];

export const postalCodeRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.resolve();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length !== 10) {
        return Promise.reject(i18n.t("rules.postalCodeDigit"));
      }
      return Promise.resolve();
    },
  }),
];

export const emailRules: RuleObject[] = [
  {
    type: "email",
    message: i18n.t("rules.invalidEmail"),
  },
];

export const requiredRules: RuleObject[] = [
  { required: true, message: i18n.t("rules.requiredField") },
];

export const digitRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (isNaN(Number(value))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      return Promise.resolve();
    },
  }),
];

export const passwordRules: RuleObject[] = [
  {
    min: 8,
    // pattern: /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).*$/,
    message: i18n.t("rules.passPattern"),
  },
];

export const insuNumberRules: ValidatorRule[] = [
  () => ({
    validator(_: RuleObject, value: string): Promise<void> {
      if (!value) {
        return Promise.resolve();
      }
      if (isNaN(Number(toEnglishDigits(value)))) {
        return Promise.reject(i18n.t("rules.enterNumber"));
      }
      if (value.length !== 8) {
        return Promise.reject(i18n.t("rules.insuNum"));
      }
      return Promise.resolve();
    },
  }),
];
