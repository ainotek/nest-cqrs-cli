#!/usr/bin/env node

import chalk from "chalk";
import {Command} from "commander";
import path from "path";

import {
    toCamelCase,
    createFile,
    updateIndexFileGeneric,
} from "../helpers/utils.js";
import {
    getRepositoryFileContent, getUseCaseFileContent,
} from "../helpers/templates.js";
import fs from "fs";


const program = new Command();

program
    .version("1.0.0")
    .description(chalk.blue("Generate a new use case"))
    .argument("<module>", "Name of the module")
    .argument("<usecase>", "Name of the use case")
    .action((module, usecase) => {
        const moduleName = module.toLowerCase();
        const nameFeature = usecase.toLowerCase();

        const basePath = path.join(process.cwd(), "src", "modules", moduleName);
        // check if the module exists
        if (!fs.existsSync(basePath)) {
            console.log("Module not found");
        } else {
            const indexFilePath = path.join(basePath, "application", "domain", "usecases", `index.ts`);
            if (!fs.existsSync(indexFilePath)) {
                createFile(indexFilePath, `export const ${nameFeature}UseCase = [\n];\n`);
            }
            const filePath = path.join(basePath, "application", "domain", "usecases", `${nameFeature}.use-case.ts`);
            const fileContent = getUseCaseFileContent(moduleName, nameFeature);
            createFile(filePath, fileContent);

            const importName = toCamelCase(nameFeature) + toCamelCase(moduleName) + 'UseCase';
            const importLine = `import { ${importName} } from "@modules/${moduleName}/application/domain/usecases/${nameFeature}.use-case";\n`;
            updateIndexFileGeneric(indexFilePath, importName, importLine, 'UseCases');
        }

        console.log("Use case created with success.");
    });


program.parse(process.argv);