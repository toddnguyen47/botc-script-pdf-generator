import { QueryClient } from "@tanstack/query-core";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ComponentChildren } from "preact";

export const queryClient = new QueryClient();

export function QueryProvider({ children }: { children: ComponentChildren }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
