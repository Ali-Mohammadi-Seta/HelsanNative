import { describe, it, expect } from "vitest";
import { groupBy } from "../groupBy";

describe("groupBy", () => {
  interface Person {
    id: number;
    name: string;
    age: number;
    city: string;
  }

  describe("grouping by string property", () => {
    it("should group objects by a string property", () => {
      const people: Person[] = [
        { id: 1, name: "Alice", age: 25, city: "Tehran" },
        { id: 2, name: "Bob", age: 30, city: "Isfahan" },
        { id: 3, name: "Charlie", age: 25, city: "Tehran" },
        { id: 4, name: "David", age: 30, city: "Isfahan" },
      ];

      const result = groupBy(people, "city");

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[0][0].city).toBe("Tehran");
      expect(result[1][0].city).toBe("Isfahan");
    });

    it("should group objects by name property", () => {
      const items = [
        { id: 1, name: "Apple", category: "Fruit" },
        { id: 2, name: "Banana", category: "Fruit" },
        { id: 3, name: "Carrot", category: "Vegetable" },
      ];

      const result = groupBy(items, "name");

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toHaveLength(1);
      expect(result[2]).toHaveLength(1);
    });
  });

  describe("grouping by number property", () => {
    it("should group objects by a number property", () => {
      const people: Person[] = [
        { id: 1, name: "Alice", age: 25, city: "Tehran" },
        { id: 2, name: "Bob", age: 30, city: "Isfahan" },
        { id: 3, name: "Charlie", age: 25, city: "Tehran" },
        { id: 4, name: "David", age: 30, city: "Isfahan" },
      ];

      const result = groupBy(people, "age");

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[0][0].age).toBe(25);
      expect(result[1][0].age).toBe(30);
    });
  });

  describe("edge cases", () => {
    it("should handle empty array", () => {
      const result = groupBy([], "name" as keyof Person);
      expect(result).toEqual([]);
    });

    it("should handle array with single item", () => {
      const items = [{ id: 1, name: "Test", category: "A" }];
      const result = groupBy(items, "category");
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(1);
      expect(result[0][0]).toEqual(items[0]);
    });

    it("should handle array where all items have same property value", () => {
      const items = [
        { id: 1, name: "A", category: "Same" },
        { id: 2, name: "B", category: "Same" },
        { id: 3, name: "C", category: "Same" },
      ];

      const result = groupBy(items, "category");
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveLength(3);
    });

    it("should handle array where all items have unique property values", () => {
      const items = [
        { id: 1, name: "A", category: "Cat1" },
        { id: 2, name: "B", category: "Cat2" },
        { id: 3, name: "C", category: "Cat3" },
      ];

      const result = groupBy(items, "category");
      expect(result).toHaveLength(3);
      expect(result[0]).toHaveLength(1);
      expect(result[1]).toHaveLength(1);
      expect(result[2]).toHaveLength(1);
    });
  });

  describe("type safety", () => {
    it("should work with different object types", () => {
      interface Product {
        id: string;
        price: number;
      }

      const products: Product[] = [
        { id: "1", price: 100 },
        { id: "2", price: 200 },
        { id: "3", price: 100 },
      ];

      const result = groupBy(products, "price");
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveLength(2);
      expect(result[1]).toHaveLength(1);
    });
  });
});

