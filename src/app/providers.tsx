"use client";

import { useState, type ReactNode } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/client/store";
import { Toasts } from "@/components/Toasts";

export function Providers({ children }: { children: ReactNode }) {
  const [store] = useState(makeStore);
  return (
    <Provider store={store}>
      {children}
      <Toasts />
    </Provider>
  );
}
