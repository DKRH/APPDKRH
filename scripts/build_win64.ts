import { $ } from "bun";
import { mkdir, readdir, cp } from "node:fs/promises";
import { join, extname } from "node:path";

const publishDir = "./wrappers/win64/bin/Release/net8.0-windows/win-x64/publish";

const distDir = "dist_win64";

const publishExists = await Bun.file(
	join(publishDir, "DKRH.exe"),
).exists();

if (!publishExists) {
	throw new Error(
		`Publish directory not found:\n${publishDir}\n\nRun "bun run build:win64" first.`,
	);
}

await mkdir(distDir, { recursive: true });

for (const file of await readdir(publishDir)) {
	const ext = extname(file).toLowerCase();

	if (ext === ".exe" || ext === ".dll") {
		await cp(
			join(publishDir, file),
			join(distDir, file),
			{ force: true },
		);
	}
}

console.log("Desktop files copied.");