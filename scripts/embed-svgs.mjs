import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname } from "node:path";

const targets = [
  ["public/assets/main.svg", "src/promo/_svg/main.ts"],
  ["public/assets/server-overview.svg", "src/promo/_svg/serverOverview.ts"],
];

for (const [src, dst] of targets) {
  const content = readFileSync(src, "utf8");
  const dir = dirname(dst);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  const escaped = content
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");
  writeFileSync(
    dst,
    `// Auto-generated from ${src}. Do not edit by hand.\nexport default \`${escaped}\`;\n`,
    "utf8",
  );
  console.log(`Embedded ${src} -> ${dst} (${content.length} chars)`);
}
