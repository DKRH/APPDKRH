import { $ } from "bun";
import { mkdir, cp } from "node:fs/promises";

const apk = "app/build/outputs/apk/debug/app-debug.apk";
const distDir = "../../../dist_android";

if (!(await Bun.file(apk).exists())) {
	throw new Error(
		`APK not found:\n${apk}\n\nRun "bun run build:android" first.`,
	);
}

await mkdir(distDir, { recursive: true });

await cp(
	apk,
	`${distDir}/DKRH.apk`,
	{ force: true },
);

console.log("Android APK copied.");