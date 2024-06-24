#!/usr/bin/env node

import chalk from "chalk";
import { Command } from "commander";
import path from "path";
import {
  toPascalCase,
  toCamelCase,
  createFile,
  createStructure,
} from "./helpers/utils.js";
import {
  getCommandFileContent,
  getIndexFileContent,
  getModuleFileContent,
} from "./helpers/templates.js";

const program = new Command();

program
  .version("1.0.0")
  .description(chalk.blue("CLI pour générer une architecture CQRS avec NestJS"))
  .argument("<module>", "Nom du module")
  .option("--crud", "Ajouter des fichiers CRUD")
  .action((module, options) => {
    const moduleName = module.toLowerCase();
    const pascalCaseModuleName = toPascalCase(moduleName);
    const basePath = path.join(process.cwd(), "src", "modules", moduleName);

    const structure = {
      application: {
        commands: ["index.ts"],
        controllers: ["index.ts"],
        queries: ["index.ts"],
        domain: {
          entities: ["index.ts"],
          events: ["index.ts"],
          usecases: ["index.ts"],
        },
        dto: {
          requests: ["index.ts"],
          responses: ["index.ts"],
        },
      },
      infrastructures: {
        mappers: ["index.ts"],
        "orm-entities": ["index.ts"],
        repositories: ["index.ts"],
      },
    };

    const createFileCallback = (filePath, name) => {
      const exportName = toCamelCase(name);
      const upateName =
        exportName == "Usecases"
          ? "UseCases"
          : exportName == "Commands"
          ? "CommandHandlers"
          : exportName;
      const fileContent = `export const ${upateName} = [\n];\n`;
      createFile(filePath, fileContent);
    };

    createStructure(basePath, structure, createFileCallback);

    const moduleFilePath = path.join(basePath, `${moduleName}.module.ts`);
    const moduleFileContent = getModuleFileContent(moduleName);
    createFile(moduleFilePath, moduleFileContent.trim());

    if (options.crud) {
      const crudActions = ["create", "update", "delete"];
      const commandsPath = path.join(basePath, "application", "commands");
      const handlers = crudActions.map((action) => ({
        functionName: toPascalCase(`${action}-${moduleName}`),
        fileName: action,
      }));

      crudActions.forEach((action) => {
        const commandFilePath = path.join(
          commandsPath,
          `${action}-${moduleName}.command.ts`
        );
        const commandFileContent = getCommandFileContent(moduleName, action);
        createFile(commandFilePath, commandFileContent.trim());
      });

      const indexFilePath = path.join(commandsPath, "index.ts");
      const indexFileContent = getIndexFileContent(moduleName, handlers);
      createFile(indexFilePath, indexFileContent.trim());
    }

    console.log("Architecture CQRS générée avec succès.");
  });

program.parse(process.argv);
