import { describe, it, expect } from "vitest";
import { nationalIdValidator } from "../NationalIdValidator";

describe("nationalIdValidator", () => {
  describe("valid national IDs", () => {
    it("should validate any 10-digit number", () => {
      expect(nationalIdValidator("0123456789")).toBe(true);
      expect(nationalIdValidator("1234567890")).toBe(true);
      expect(nationalIdValidator("9876543210")).toBe(true);
      expect(nationalIdValidator("1111111111")).toBe(true);
      expect(nationalIdValidator("0001234567")).toBe(true);
      expect(nationalIdValidator("0000000000")).toBe(true);
    });
  });

  describe("invalid formats", () => {
    it("should reject IDs with less than 10 digits", () => {
      expect(nationalIdValidator("123456789")).toBe(false);
      expect(nationalIdValidator("12345")).toBe(false);
      expect(nationalIdValidator("")).toBe(false);
      expect(nationalIdValidator("1")).toBe(false);
    });

    it("should reject IDs with more than 10 digits", () => {
      expect(nationalIdValidator("12345678901")).toBe(false);
      expect(nationalIdValidator("123456789012345")).toBe(false);
    });

    it("should reject IDs with non-numeric characters", () => {
      expect(nationalIdValidator("123456789a")).toBe(false);
      expect(nationalIdValidator("abc1234567")).toBe(false);
      expect(nationalIdValidator("123-456-789")).toBe(false);
    });

    it("should reject IDs with whitespace", () => {
      expect(nationalIdValidator(" 1234567890")).toBe(false);
      expect(nationalIdValidator("1234567890 ")).toBe(false);
      expect(nationalIdValidator("123 4567890")).toBe(false);
    });

    it("should reject IDs with special characters", () => {
      expect(nationalIdValidator("123.456.789")).toBe(false);
      expect(nationalIdValidator("123456789-0")).toBe(false);
      expect(nationalIdValidator("1234-567890")).toBe(false);
    });
  });
});

