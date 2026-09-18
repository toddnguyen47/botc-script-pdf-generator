import { render } from "preact";
import { App } from "./app";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { loadRoles, loadNightsheet, loadJinxes } from "botc-character-sheet";

async function main() {
  await loadRoles();
  await loadNightsheet();
  await loadJinxes();

  // Refresh every 15 minutes
  setInterval(
    () => {
      loadRoles().catch((error) => {
        console.error("Failed to refresh roles:", error);
      });
      loadNightsheet().catch((error) => {
        console.error("Failed to refresh nightsheet:", error);
      });
      loadJinxes().catch((error) => {
        console.error("Failed to refresh jinxes:", error);
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
