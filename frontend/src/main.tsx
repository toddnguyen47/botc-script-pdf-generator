import { render } from "preact";
import { App } from "./app";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { loadRoles } from "botc-character-sheet";

async function main() {
  await loadRoles();

  // Refresh every 15 minutes
  setInterval(
    () => {
      loadRoles().catch((error) => {
        console.error("Failed to refresh roles:", error);
      });
    },
    15 * 60 * 1000,
  );

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
