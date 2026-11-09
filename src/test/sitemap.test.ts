import { describe, expect, it } from "vitest";
import { Route as dashboard } from "@/routes/dashboard";
import { Route as profile } from "@/routes/profile";
import { Route as auth } from "@/routes/auth";
import { Route as lesson } from "@/routes/learn.$id";
import { Route as learn } from "@/routes/learn.index";
import { sitemapXML } from "@/lib/sitemap";

describe("sitemap decisions", () => {
  it("keeps personal student pages out of the sitemap", () => {
    for (const route of [dashboard, profile, auth]) {
      expect(route.options.staticData?.sitemap).toBe(false);
    }
  });

  it("lists the lessons index and every lesson page", () => {
    expect(learn.options.staticData?.sitemap).toBe(true);
    expect(lesson.options.staticData?.sitemap).toBe(true);
  });

  it("builds absolute URLs on the public site", () => {
    const xml = sitemapXML("https://alsalhi-network-master.lovable.app", [{ path: "/learn/routing" }]);
    expect(xml).toContain("<loc>https://alsalhi-network-master.lovable.app/learn/routing</loc>");
  });
});
