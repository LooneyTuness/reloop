import { PropsWithChildren } from "react";
import { ReactQueryProvider } from "./react-query-provider";
import { PosthogProvider } from "./posthog-provider";

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <PosthogProvider>{children}</PosthogProvider>
    </ReactQueryProvider>
  );
}
