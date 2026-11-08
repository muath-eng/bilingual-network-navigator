import { describe, expect, it } from "vitest";
import { lessons } from "./content";

describe("lesson content integrity", () => {
  it("keeps all six troubleshooting scenarios in the lesson catalog", () => {
    const scenarioIds = ["s5", "s6", "s7", "s8", "s9", "s10"];
    for (const id of scenarioIds) {
      const lesson = lessons.find((item) => item.id === id);
      expect(lesson).toBeDefined();
      expect(lesson?.bodyAr.length).toBeGreaterThan(0);
      expect(lesson?.bodyEn.length).toBeGreaterThan(0);
      expect(lesson?.quiz.length).toBeGreaterThan(0);
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
