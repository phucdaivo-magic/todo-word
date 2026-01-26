import fs from "fs";
import path from "path";
import { parseFile } from "./css-magi.js";
import postcss from "postcss";
import cssnano from "cssnano";

const scanDir = (dir, files = []) => {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name === "node_modules") continue;
      scanDir(fullPath, files);
    } else if (
      entry.isFile() &&
      (fullPath.endsWith(".html"))
    ) {
      files.push(fullPath);
    }
  }

  return files;
}

const extractClassNames = (code) => {
  const classSet = new Set();

  // match: className="..."
  const regex = /class\s*=\s*["'`]([^"'`]*)["'`]/g;

  let match;
  while ((match = regex.exec(code)) !== null) {
    match[1]
      .split(/\s+/)
      .filter(Boolean)
      .forEach(cls => classSet.add(cls));
  }

  return classSet;
}

const generateCSS = async (map, minify = false) => {
  const root = postcss.root();

  Object.values(map).forEach(({ media, query, property, value }) => {
    const rule = postcss.rule({
      selector: `.${query}`
    });

    rule.append({
      prop: property,
      value: value
    });

    if (media) {
      const params = media.replace(/@media/, "");
      const atRule = postcss.atRule({
        name: "media",
        params: params
      });
      atRule.append(rule);
      root.append(atRule);
    } else {
      root.append(rule);
    }
  });

  const result = await postcss(minify ? [cssnano] : []).process(root.toString(), {
    from: undefined
  });

  return result.css;
  // return root.toString();
}

const useFileOutput = (file, outDir) => {
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }
  const fileName = path.basename(file).replace('.html', '.css');
  const outDirPath = path.resolve(outDir);
  const outFile = path.join(outDirPath, fileName);
  return outFile;
}

const generateCSSForFile = async ({ srcDir, outDir, minify = false }) => {
  const srcDirPath = path.resolve(srcDir);
  const files = scanDir(srcDirPath);
  const allClasses = new Set();

  for (const file of files) {
    const contentFile = fs.readFileSync(file, "utf8");
    const classes = extractClassNames(contentFile);

    classes.forEach(c => allClasses.add(c));

    const uniqueClasses = parseFile(Array.from(classes));
    const css = await generateCSS(uniqueClasses, minify);

    const outFile = useFileOutput(file, outDir);
    fs.writeFileSync(outFile, css, "utf8");
  }

  const uniqueClasses = parseFile(Array.from(allClasses));
  const outDirPath = path.resolve(outDir);
  const bundleCss = await generateCSS(uniqueClasses, minify);
  const outFile = path.join(outDirPath, "bundle.css");
  fs.writeFileSync(outFile, bundleCss, "utf8");
}

// generateCSSForFile({
//   srcDir: "www",
//   outDir: "www/styles",
//   minify: true,
// });

export { generateCSSForFile };

