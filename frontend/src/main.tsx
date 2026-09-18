import { render } from "preact";
import { App } from "./app";
import { ErrorBoundary } from "./components/ErrorBoundary";

async function main() {
  const root = document.getElementById("app");
  if (root) {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>,
      root,
    );
  }
}

main();
