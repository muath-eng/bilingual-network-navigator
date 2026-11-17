import { createElement, type ComponentType } from "react";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { scenarios } from "@/lib/content";
import { LangProvider } from "@/lib/i18n";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({ options }),
}));

import { Route } from "@/routes/troubleshoot";

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe("Troubleshooting regression", () => {
  for (const lang of ["ar", "en"] as const) {
    it(`renders and answers all fifteen drills in ${lang} without missing options`, () => {
      localStorage.setItem("nm-lang", lang);
      render(
        <LangProvider>{createElement(Route.options.component as ComponentType)}</LangProvider>,
      );
      for (const scenario of scenarios) {
        const heading = screen.getByRole("heading", {
          name: lang === "ar" ? scenario.titleAr : scenario.titleEn,
        });
        const block = heading.parentElement;
        if (!block) throw new Error(`Missing scenario ${scenario.id}`);
        const scope = within(block);
        const options = lang === "ar" ? scenario.optionsAr : scenario.optionsEn;
        expect(scope.getAllByRole("button")).toHaveLength(options.length);
        fireEvent.click(
          scope.getByRole("button", {
            name: options[(scenario.answer + 1) % options.length],
          }),
        );
        expect(scope.getByText(/^(ليس تماماً\.|Not quite\.)/)).toBeInTheDocument();
        fireEvent.click(scope.getByRole("button", { name: options[scenario.answer] }));
        expect(scope.getByText(/^(صحيح!|Correct!)/)).toBeInTheDocument();
      }
    });
  }

  for (const lang of ["ar", "en"] as const) {
    it(`tracks answered scenarios and resets progress in ${lang}`, () => {
      localStorage.setItem("nm-lang", lang);
      render(
        <LangProvider>{createElement(Route.options.component as ComponentType)}</LangProvider>,
      );
      const progress = screen.getByRole("progressbar", {
        name: lang === "ar" ? "تقدم التدريب" : "Training progress",
      });
      expect(progress).toHaveAttribute("aria-valuenow", "0");
      const first = scenarios[0];
      if (!first) throw new Error("Missing first troubleshooting scenario");
      const options = lang === "ar" ? first.optionsAr : first.optionsEn;
      const heading = screen.getByRole("heading", {
        name: lang === "ar" ? first.titleAr : first.titleEn,
      });
      const scope = within(heading.parentElement!);
      fireEvent.click(scope.getByRole("button", { name: options[first.answer] }));
      expect(progress).toHaveAttribute("aria-valuenow", "1");
      expect(screen.getByText(lang === "ar" ? "1 / 1" : "1 / 1")).toBeInTheDocument();
      fireEvent.click(
        screen.getByRole("button", {
          name: lang === "ar" ? "إعادة المحاولة" : "Reset practice",
        }),
      );
      expect(progress).toHaveAttribute("aria-valuenow", "0");
    });
  }
});
