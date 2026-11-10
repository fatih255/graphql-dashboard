import { createSlice, nanoid, type PayloadAction } from "@reduxjs/toolkit";
import type { CampaignStatus } from "@/gql/graphql";

export type StatusFilter = CampaignStatus | "ALL";

export interface Toast {
  id: string;
  tone: "error" | "success";
  message: string;
}

export interface UiState {
  statusFilter: StatusFilter;
  search: string;
  toasts: Toast[];
}

export const initialUiState: UiState = { statusFilter: "ALL", search: "", toasts: [] };

const MAX_TOASTS = 3;

export const uiSlice = createSlice({
  name: "ui",
  initialState: initialUiState,
  reducers: {
    statusFilterChanged(state, action: PayloadAction<StatusFilter>) {
      state.statusFilter = action.payload;
    },
    searchChanged(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
    toastShown: {
      reducer(state, action: PayloadAction<Toast>) {
        state.toasts.push(action.payload);
        if (state.toasts.length > MAX_TOASTS) state.toasts.shift();
      },
      prepare(tone: Toast["tone"], message: string) {
        return { payload: { id: nanoid(), tone, message } };
      },
    },
    toastDismissed(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
  },
});

export const { statusFilterChanged, searchChanged, toastShown, toastDismissed } = uiSlice.actions;
