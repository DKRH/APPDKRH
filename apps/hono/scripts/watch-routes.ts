import { watch } from "fs";
import { $ } from "bun";

let generating = false;

async function generate() {
  if (generating) return;

  generating = true;

  try {
    await $`bun run scripts/generate-routes.ts`;
    console.log("✓ Routes manifest updated");
  } catch (error) {
    console.error("Failed to generate routes:", error);
  } finally {
    generating = false;
  }
}

await generate();

watch(
  "./src/modules",
  { recursive: true },
  async (_, filename) => {
    if (!filename) return;

    const file = filename.replace(/\\/g, "/");

    if (!/(^|\/)route\.(ts|js)$/.test(file)) {
      return;
    }

    console.log(`Route changed: ${file}`);

    await generate();
  },
);

console.log("Watching route files...");