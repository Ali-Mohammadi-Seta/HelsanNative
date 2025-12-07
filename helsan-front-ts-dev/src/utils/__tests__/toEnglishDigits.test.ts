import { describe, it, expect } from "vitest";
import { toEnglishDigits } from "../toEnglishDigits";

describe("toEnglishDigits", () => {
  it("should convert Persian digits to English digits", () => {
    expect(toEnglishDigits("۰۱۲۳۴۵۶۷۸۹")).toBe("0123456789");
    expect(toEnglishDigits("۰")).toBe("0");
    expect(toEnglishDigits("۹")).toBe("9");
  });

  it("should convert Arabic-Indic digits to English digits", () => {
    expect(toEnglishDigits("٠١٢٣٤٥٦٧٨٩")).toBe("0123456789");
    expect(toEnglishDigits("٠")).toBe("0");
    expect(toEnglishDigits("٩")).toBe("9");
  });

  it("should handle mixed Persian and Arabic digits", () => {
    expect(toEnglishDigits("۰۱۲٣٤")).toBe("01234");
  });

  it("should handle mixed text with digits", () => {
    expect(toEnglishDigits("تلفن: ۰۹۱۲۳۴۵۶۷۸۹")).toBe("تلفن: 09123456789");
    expect(toEnglishDigits("قیمت: ۱۲٬۰۰۰ تومان")).toBe("قیمت: 12٬000 تومان");
  });

  it("should return English digits as-is", () => {
    expect(toEnglishDigits("0123456789")).toBe("0123456789");
    expect(toEnglishDigits("123")).toBe("123");
  });

  it("should handle empty string", () => {
    expect(toEnglishDigits("")).toBe("");
  });

  it("should handle string with no digits", () => {
    expect(toEnglishDigits("Hello World")).toBe("Hello World");
    expect(toEnglishDigits("سلام دنیا")).toBe("سلام دنیا");
  });
});

