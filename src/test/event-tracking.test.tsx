import { createElement, type ComponentType, type MouseEvent, type ReactNode } from "react";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { lessons } from "@/lib/content";
import { LangProvider } from "@/lib/i18n";

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useLoaderData: () => ({ lesson: lessons[0] }),
  }),
  Link: ({ children, to, params, onClick, ...props }: { children: ReactNode; to: string; params?: { id: string }; onClick?: (event: MouseEvent) => void }) =>
    createElement("a", { ...props, href: to.replace("$id", params?.id ?? ""), onClick: (event: MouseEvent) => { event.preventDefault(); onClick?.(event); } }, children),
  notFound: () => new Error("Not found"),
}));

import { Route as LearnRoute } from "@/routes/learn.index";
import { Route as LessonRoute } from "@/routes/learn.$id";
import { Route as LabRoute } from "@/routes/lab";

const track = vi.fn<(event: string, properties?: Record<string, unknown>) => string | null>(() => null);
function mount(route: { options: { component?: unknown } }) {
  render(<LangProvider>{createElement(route.options.component as ComponentType)}</LangProvider>);
}
function submit(passed: boolean) {
  const lesson = lessons[0];
  if (!lesson) throw new Error("Missing lesson");
  lesson.quiz.forEach((q) => {
    const paragraph = screen.getByText(q.qAr);
    const block = paragraph.parentElement;
    if (!block) throw new Error("Missing question");
    const options = block.querySelectorAll("button");
    const button = options[passed ? q.answer : (q.answer + 1) % q.options.length];
    if (!button) throw new Error("Missing answer");
    fireEvent.click(button);
  });
  fireEvent.click(screen.getByRole("button", { name: "تحقق" }));
}

beforeEach(() => {
  localStorage.clear();
  track.mockClear();
  window.__lovableEvents = { track };
});
afterEach(() => { cleanup(); delete window.__lovableEvents; });

describe("Requested product events", () => {
  it("tracks starting a lesson from the learning path", () => {
    mount(LearnRoute);
    fireEvent.click(screen.getByRole("link", { name: /ما هي الشبكة/ }));
    expect(track).toHaveBeenCalledWith("project.lesson_started", { lesson_id: "what-is-network" });
  });
  it("tracks quiz submission and first successful completion", () => {
    mount(LessonRoute);
    submit(true);
    expect(track).toHaveBeenCalledWith("project.quiz_submitted", {
      lesson_id: "what-is-network", score: 2, question_count: 2, passed: true,
    });
    expect(track).toHaveBeenCalledWith("project.lesson_completed", { lesson_id: "what-is-network" });
  });
  it("records failed submissions without completing a lesson", () => {
    mount(LessonRoute);
    submit(false);
    expect(track).toHaveBeenCalledWith("project.quiz_submitted", {
      lesson_id: "what-is-network", score: 0, question_count: 2, passed: false,
    });
    expect(track.mock.calls.some(([name]) => name === "project.lesson_completed")).toBe(false);
  });
  it("does not double count previously completed lessons", () => {
    localStorage.setItem("nm-progress", JSON.stringify(["what-is-network"]));
    mount(LessonRoute);
    submit(true);
    expect(track.mock.calls.some(([name]) => name === "project.lesson_completed")).toBe(false);
  });
  it("tracks lab actions without addresses or device names", () => {
    mount(LabRoute);
    const pingButton = screen.getByRole("button", { name: "ping" });
    expect(pingButton).toBeDisabled();
    fireEvent.click(pingButton);
    fireEvent.click(screen.getByRole("button", { name: "Switch" }));
    expect(track).not.toHaveBeenCalledWith("project.lab_used", { action: "ping" });
    expect(track).toHaveBeenCalledWith("project.lab_used", { action: "add_device", device_kind: "switch" });
  });
  it("works when the injected tracker is absent", () => {
    delete window.__lovableEvents;
    mount(LessonRoute);
    expect(() => submit(true)).not.toThrow();
    expect(JSON.parse(localStorage.getItem("nm-progress") ?? "[]")).toContain("what-is-network");
  });
});