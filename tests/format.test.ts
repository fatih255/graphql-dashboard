import { describe, expect, it } from "vitest";
import { formatDate, previewPath, triggerSummary, urlRuleSummary } from "@/shared/format";

describe("format helpers", () => {
  it("describes each trigger", () => {
    expect(triggerSummary({ type: "ON_LOAD" }, 0)).toBe("As soon as the page loads");
    expect(triggerSummary({ type: "ON_LOAD" }, 4)).toBe("4 s after page load");
    expect(triggerSummary({ type: "EXIT_INTENT" }, 0)).toBe("When the cursor heads out of the window");
    expect(triggerSummary({ type: "SCROLL", scrollPercent: 60 }, 2)).toBe("After 60% scroll, then waits 2 s");
  });

  it("describes URL rules and builds a preview path", () => {
    expect(urlRuleSummary({ match: "EXACT", value: "/pricing" })).toBe("URL is exactly /pricing");
    expect(previewPath({ match: "EXACT", value: "/pricing" })).toBe("/pricing");
    expect(previewPath({ match: "STARTS_WITH", value: "/blog" })).toBe("/blog/example");
    expect(previewPath({ match: "CONTAINS", value: "products/" })).toBe("/products/example");
    expect(previewPath({ match: "CONTAINS", value: "" })).toBe("/");
  });

  it("formats dates in UTC", () => {
    expect(formatDate("2026-11-02T23:40:00.000Z")).toBe("Nov 2, 2026");
  });
});
