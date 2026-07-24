import {
	cpSync,
	existsSync,
	mkdirSync,
	readdirSync,
} from "node:fs";
import { extname, join } from "node:path";

const publishDir = "apps/wpf/bin/Release/net8.0-windows/win-x64/publish";

const distDir = "dist_desktop";

if (!existsSync(publishDir)) {
	throw new Error(
		`Publish directory not found:\n${publishDir}\n\nRun "bun run build:desktop" first.`
	);
}

mkdirSync(distDir, {
	recursive: true,
});

for (const file of readdirSync(publishDir)) {
	const ext = extname(file).toLowerCase();

	if (
		ext === ".exe" ||
		ext === ".dll"
	) {
		cpSync(
			join(publishDir, file),
			join(distDir, file)
		);
	}
}

console.log("Desktop files copied.");