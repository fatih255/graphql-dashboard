import { describe, expect, it } from "vitest";
import {
  initialUiState,
  searchChanged,
  statusFilterChanged,
  toastDismissed,
  toastShown,
  uiSlice,
} from "@/client/uiSlice";

const reduce = uiSlice.reducer;

describe("uiSlice", () => {
  it("stores the status filter and search", () => {
    let state = reduce(initialUiState, statusFilterChanged("PAUSED"));
    state = reduce(state, searchChanged("cart"));
    expect(state).toMatchObject({ statusFilter: "PAUSED", search: "cart" });
  });

  it("adds toasts with ids and removes them by id", () => {
    let state = reduce(initialUiState, toastShown("error", "Nope"));
    state = reduce(state, toastShown("success", "Saved"));
    expect(state.toasts.map((t) => [t.tone, t.message])).toEqual([
      ["error", "Nope"],
      ["success", "Saved"],
    ]);
    state = reduce(state, toastDismissed(state.toasts[0]!.id));
    expect(state.toasts.map((t) => t.message)).toEqual(["Saved"]);
  });

  it("keeps only the three newest toasts", () => {
    let state = initialUiState;
    for (const message of ["a", "b", "c", "d"]) state = reduce(state, toastShown("success", message));
    expect(state.toasts.map((t) => t.message)).toEqual(["b", "c", "d"]);
  });
});
