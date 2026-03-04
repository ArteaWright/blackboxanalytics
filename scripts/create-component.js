import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COMPONENTS_DIR = path.join(__dirname, "..", "app", "components");
const PAGE_PATH = path.join(__dirname, "..", "app", "page.tsx");

function getComponentNameFromArg() {
  const arg = process.argv[2];
  if (!arg || !/^[A-Z][a-zA-Z0-9]*$/.test(arg)) {
    console.error(
      "Usage: npm run create-component -- <ComponentName>\n" +
        "ComponentName must be PascalCase (e.g. MyButton, DataTable)."
    );
    process.exit(1);
  }
  return arg;
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function tsxBoilerplate(componentName) {
  const lowerName = componentName
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase();

  return `export default function ${componentName}() {
  return (
    <div className="${lowerName}">
      <h2>${componentName}</h2>
      <p>Component content goes here.</p>
    </div>
  );
}
`;
}

function cssBoilerplate() {
  return `// Add your style here
`;
}

function cyTsxBoilerplate(componentName) {
  return `import React from 'react'
import ${componentName} from './${componentName}'

describe('<${componentName} />', () => {
  it('renders', () => {
    cy.mount(<${componentName} />)
  })
})
`;
}

function addComponentToPage(componentName) {
  let content = fs.readFileSync(PAGE_PATH, "utf8");
  const importLine = `import ${componentName} from "./components/${componentName}/${componentName}";`;
  const componentTag = `<${componentName} />`;
  let changed = false;

  if (!content.includes(`from "./components/${componentName}/`)) {
    const lastImportMatch = content.match(/import .+ from .+;\n/g);
    const lastImport = lastImportMatch
      ? lastImportMatch[lastImportMatch.length - 1]
      : null;

    const insertIndex = lastImport
      ? content.indexOf(lastImport) + lastImport.length
      : content.indexOf("export default");

    content =
      content.slice(0, insertIndex) +
      "\n" +
      importLine +
      content.slice(insertIndex);

    changed = true;
  }

  if (!content.includes(componentTag)) {
    const openDivRegex = /return \(\s*<div[\s\S]*?>/;
    const divMatch = content.match(openDivRegex);

    if (divMatch) {
      const insertAt = content.indexOf(divMatch[0]) + divMatch[0].length;
      content =
        content.slice(0, insertAt) +
        "\n      " +
        componentTag +
        content.slice(insertAt);
    } else {
      content = content.replace(
        /return \(\s*<div/,
        `return (\n    <div>\n      ${componentTag}\n    <div`
      );
    }

    changed = true;
  }

  if (changed) {
    fs.writeFileSync(PAGE_PATH, content, "utf8");
  }
}

function main() {
  const componentName = getComponentNameFromArg();
  const componentDir = path.join(COMPONENTS_DIR, componentName);

  const tsxPath = path.join(componentDir, `${componentName}.tsx`);
  const cssPath = path.join(componentDir, `${componentName}.css`);
  const cyTsxPath = path.join(componentDir, `${componentName}.cy.tsx`);

  if (fs.existsSync(tsxPath)) {
    console.error(`Component already exists: ${componentName}`);
    process.exit(1);
  }

  ensureDir(componentDir);

  fs.writeFileSync(tsxPath, tsxBoilerplate(componentName), "utf8");
  fs.writeFileSync(cssPath, cssBoilerplate(componentName), "utf8");
  fs.writeFileSync(cyTsxPath, cyTsxBoilerplate(componentName), "utf8");

  addComponentToPage(componentName);

  console.log(`Created component: ${componentName}`);
  console.log(`  ${path.relative(process.cwd(), tsxPath)}`);
  console.log(`  ${path.relative(process.cwd(), cssPath)}`);
  console.log(`  ${path.relative(process.cwd(), cyTsxPath)}`);
  console.log(
    `  Updated app/page.tsx to import and render <${componentName} />`
  );
}

main();