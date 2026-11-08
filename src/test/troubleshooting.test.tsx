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
    it(`renders and answers all ten drills in ${lang} without missing options`, () => {
      localStorage.setItem("nm-lang", lang);
      render(<LangProvider>{createElement(Route.options.component as ComponentType)}</LangProvider>);
      for (const scenario of scenarios) {
        const heading = screen.getByRole("heading", { name: lang === "ar" ? scenario.titleAr : scenario.titleEn });
        const block = heading.parentElement;
        if (!block) throw new Error(`Missing scenario ${scenario.id}`);
        const scope = within(block);
        const options = lang === "ar" ? scenario.optionsAr : scenario.optionsEn;
        expect(scope.getAllByRole("button")).toHaveLength(options.length);
        fireEvent.click(scope.getByRole("button", { name: options[(scenario.answer + 1) % options.length], exact: true }));
        expect(scope.getByText(/^(ليس تماماً\.|Not quite\.)/)).toBeInTheDocument();
        fireEvent.click(scope.getByRole("button", { name: options[scenario.answer], exact: true }));
        expect(scope.getByText(/^(صحيح!|Correct!)/)).toBeInTheDocument();
      }
    });
  }
});