import { describe, expect, it } from "vitest";
import { lessons, scenarios } from "./content";

describe("lesson content integrity", () => {
  it("keeps all six troubleshooting scenarios in the scenario catalog", () => {
    const scenarioIds = ["s5", "s6", "s7", "s8", "s9", "s10"];
    for (const id of scenarioIds) {
      const scenario = scenarios.find((item) => item.id === id);
      expect(scenario).toBeDefined();
      expect(lessons.some((lesson) => lesson.id === id)).toBe(false);
    }
  });

  it("provides the complete bilingual drill contract for every scenario", () => {
    expect(scenarios).toHaveLength(10);
    expect(new Set(scenarios.map((scenario) => scenario.id)).size).toBe(10);
    for (const scenario of scenarios) {
      for (const value of [scenario.infoAr, scenario.infoEn, scenario.explainAr, scenario.explainEn]) {
        expect(typeof value).toBe("string");
        expect(value.trim().length).toBeGreaterThan(0);
      }
      expect(Number.isInteger(scenario.answer)).toBe(true);
      expect(scenario.optionsAr.length).toBe(scenario.optionsEn.length);
      for (const options of [scenario.optionsAr, scenario.optionsEn]) {
        expect(Array.isArray(options)).toBe(true);
        expect(options.length).toBeGreaterThan(1);
        expect(options.every((option) => typeof option === "string" && option.trim().length > 0)).toBe(true);
        expect(scenario.answer).toBeGreaterThanOrEqual(0);
        expect(scenario.answer).toBeLessThan(options.length);
      }
    }
  });

  it("provides valid quiz options and answer indexes for every lesson", () => {
    for (const lesson of lessons) {
      expect(Array.isArray(lesson.quiz)).toBe(true);
      for (const question of lesson.quiz) {
        expect(question.options.length).toBeGreaterThan(1);
        expect(question.answer).toBeGreaterThanOrEqual(0);
        expect(question.answer).toBeLessThan(question.options.length);
      }
    }
  });
});
