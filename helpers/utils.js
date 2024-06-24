import fs from "fs";
import path from "path";

export const toCamelCase = (str) => {
  return str
    .replace(/-./g, (match) => match[1].toUpperCase())
    .replace(/^./, (match) => match.toUpperCase());
};

export const toPascalCase = (str) => {
  return str.replace(/(^\w|-\w)/g, (match) =>
    match.replace("-", "").toUpperCase()
  );
};

export const createFile = (filePath, content) => {
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
};

export const createStructure = (base, structure, createFileCallback) => {
  Object.entries(structure).forEach(([name, content]) => {
    const newPath = path.join(base, name);
    if (Array.isArray(content)) {
      fs.mkdirSync(newPath, { recursive: true });
      content.forEach((file) => {
        const filePath = path.join(newPath, file);
        createFileCallback(filePath, name);
      });
    } else {
      fs.mkdirSync(newPath, { recursive: true });
      createStructure(newPath, content, createFileCallback);
    }
  });
};
