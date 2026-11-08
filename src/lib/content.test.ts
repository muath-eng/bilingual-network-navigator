import { describe, expect, it } from "vitest";
import { lessons, scenarios } from "./content";

describe("lesson content integrity", () => {
  it("keeps all six troubleshooting scenarios in the scenario catalog", () => {
    const scenarioIds = ["s5", "s6", "s7", "s8", "s9", "s10"];
    for (const id of scenarioIds) {
      const scenario = scenarios.find((item) => item.id === id);
      expect(scenario).toBeDefined();
      expect(scenario?.bodyAr.length).toBeGreaterThan(0);
      expect(scenario?.bodyEn.length).toBeGreaterThan(0);
      expect(scenario?.quiz.length).toBeGreaterThan(0);
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
