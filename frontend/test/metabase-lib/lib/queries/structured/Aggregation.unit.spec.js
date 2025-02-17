import { ORDERS } from "__support__/sample_database_fixture";
import Aggregation from "metabase-lib/lib/queries/structured/Aggregation";

const query = ORDERS.query();

function aggregationForMBQL(mbql) {
  return new Aggregation(mbql, 0, query);
}

describe("Aggregation", () => {
  describe("displayName", () => {
    it("should format basic aggregation", () => {
      expect(aggregationForMBQL(["count"]).displayName()).toEqual("Count");
    });
    it("should format custom aggregation", () => {
      expect(
        aggregationForMBQL([
          "+",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          42,
        ]).displayName(),
      ).toEqual("Sum(Total) + 42");
    });
    it("should format custom aggregation with expression inside aggregation", () => {
      expect(
        aggregationForMBQL([
          "sum",
          ["+", ["field", ORDERS.TOTAL.id, null], 42],
        ]).displayName(),
      ).toEqual("Sum(Total + 42)");
    });
    it("should format named aggregation", () => {
      expect(
        aggregationForMBQL([
          "aggregation-options",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          { "display-name": "named" },
        ]).displayName(),
      ).toEqual("named");
    });
    it("should format saved metric", () => {
      expect(aggregationForMBQL(["metric", 1]).displayName()).toEqual(
        "Total Order Value",
      );
    });
    it("should format aggregation with aggregation-options but not display-name", () => {
      expect(
        aggregationForMBQL([
          "aggregation-options",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          {},
        ]).displayName(),
      ).toEqual("Sum of Total");
    });
  });
  describe("isValid", () => {
    it("should be true for basic aggregation", () => {
      expect(aggregationForMBQL(["count"]).isValid()).toBe(true);
    });
    it("should be true for custom aggregation", () => {
      expect(
        aggregationForMBQL([
          "+",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          42,
        ]).isValid(),
      ).toBe(true);
    });
    it("should be true for custom aggregation with expression inside aggregation", () => {
      expect(
        aggregationForMBQL([
          "sum",
          ["+", ["field", ORDERS.TOTAL.id, null], 42],
        ]).isValid(),
      ).toBe(true);
    });
    it("should be true for named aggregation", () => {
      expect(
        aggregationForMBQL([
          "aggregation-options",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          { "display-name": "named" },
        ]).isValid(),
      ).toBe(true);
    });
    it("should be true for saved metric", () => {
      expect(aggregationForMBQL(["metric", 1]).isValid()).toBe(true);
    });
    it("should be true for aggregation with aggregation-options but not display-name", () => {
      expect(
        aggregationForMBQL([
          "aggregation-options",
          ["sum", ["field", ORDERS.TOTAL.id, null]],
          {},
        ]).isValid(),
      ).toBe(true);
    });
  });
});
