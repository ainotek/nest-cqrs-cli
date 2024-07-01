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
    getRepositoryFileContent,
} from "../helpers/templates.js";
import fs from "fs";


const program = new Command();

program
    .version("1.0.0")
    .description(chalk.blue("Generate a new repository"))
    .argument("<module>", "Name of the module")
    .argument("<repository>", "Name of the repository")
    .option("--crud", "Add files CRUD")
    .action((module, repository, options) => {
        const moduleName = module.toLowerCase();
        const repositoryName = repository.toLowerCase();

        const basePath = path.join(process.cwd(), "src", "modules", moduleName);
        // check if the module exists
        if (!fs.existsSync(basePath)) {
            console.log("Module not found");
        } else {
            //check if the repository exists
            const repositoryIndexFilePath = path.join(basePath, "infrastructures", "repositories", `index.ts`);
            if (!fs.existsSync(repositoryIndexFilePath)) {
                console.log("Repository index not found");
                // create the repository
                const fileIndexPath = path.join(basePath, "infrastructures", "repositories", `index.ts`);
                createFile(fileIndexPath, `export const ${repositoryName}Repository = [\n];\n`);
            }
            const filePath = path.join(basePath, "infrastructures", "repositories", `${repository}.repository.ts`);
            const fileContent = getRepositoryFileContent(repositoryName);
            createFile(filePath, fileContent);

            const importRepositoryName = toCamelCase(repositoryName) + 'Repository';
            const importRepositoryLine = `import { ${importRepositoryName} } from "@modules/${moduleName}/infrastructures/repositories/${repositoryName}.repository";\n`;
            updateIndexFileGeneric(repositoryIndexFilePath, importRepositoryName, importRepositoryLine, 'Repositories');
        }

        console.log("Repository created with success.");
    });


program.parse(process.argv);