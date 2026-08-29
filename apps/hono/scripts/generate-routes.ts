import { relative, dirname } from "node:path";

const modulesDir = "./src/modules";
const outputFile = "./src/generated/routes.generated.ts";

const glob = new Bun.Glob("**/route.{ts,js}");

const routes: {
  importPath: string;
  routePath: string;
  name: string;
}[] = [];

let index = 0;

for await (const file of glob.scan({
  cwd: modulesDir,
  absolute: true,
})) {
  if (file.endsWith(".d.ts")) continue;

  const routeDir = relative(
    modulesDir,
    dirname(file),
  ).replace(/\\/g, "/");

  const importPath = `../modules/${routeDir}/route`;
  const name = `route${index++}`;

  routes.push({
    importPath,
    routePath: `/${routeDir}`,
    name,
  });
}

let output = "";

for (const route of routes) {
  output += `import ${route.name} from "${route.importPath}";\n`;
}

output += "\nexport const routes = [\n";

for (const route of routes) {
  output += `  {\n`;
  output += `    path: "${route.routePath}",\n`;
  output += `    route: ${route.name},\n`;
  output += `  },\n`;
}

output += `];\n`;

await Bun.write(outputFile, output);

console.log(`✓ Generated ${routes.length} routes`);