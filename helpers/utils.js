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
            fs.mkdirSync(newPath, {recursive: true});
            content.forEach((file) => {
                const filePath = path.join(newPath, file);
                createFileCallback(filePath, name);
            });
        } else {
            fs.mkdirSync(newPath, {recursive: true});
            createStructure(newPath, content, createFileCallback);
        }
    });
};

export const updateIndexFileGeneric = (indexPath, importName, importLine, nameExport) => {
    const exportLine = `  ${importName},\n`;
    let indexContent = "";
    if (fs.existsSync(indexPath)) {
        indexContent = fs.readFileSync(indexPath, "utf-8");
    }

    if (!indexContent.includes(importLine)) {
        const importSectionEnd = indexContent.indexOf(`export const ${nameExport}`);
        indexContent = indexContent.slice(0, importSectionEnd) + importLine + indexContent.slice(importSectionEnd);
    }

    if (!indexContent.includes(exportLine)) {
        const exportSectionStart = indexContent.indexOf(`export const ${nameExport} = [`) + `export const ${nameExport} = [`.length;
        indexContent = indexContent.slice(0, exportSectionStart) + `\n  ${importName},` + indexContent.slice(exportSectionStart);
    }
    fs.writeFileSync(indexPath, indexContent);
};
