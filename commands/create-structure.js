#!/usr/bin/env node

import chalk from "chalk";
import {Command} from "commander";
import path from "path";
import {
    toPascalCase,
    toCamelCase,
    createFile,
    createStructure, updateIndexFileGeneric,
} from "../helpers/utils.js";
import {
    getCommandFileContent,
    getDtoRequestFileContent,
    getEntityFileContent,
    getIndexFileContent, getMapperFileContent,
    getModuleFileContent, getOrmEntityFileContent,
    getQueriesFileAllContent,
    getQueriesFileOneContent, getRepositoryFileContent,
    getUseCaseFileContent,
} from "../helpers/templates.js";

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
            const updateName =
                exportName === "Usecases"
                    ? "UseCases"
                    : exportName === "Commands"
                        ? "CommandHandlers"
                        : exportName;
            const fileContent = `export const ${updateName} = [\n];\n`;
            createFile(filePath, fileContent);
        };

        createStructure(basePath, structure, createFileCallback);

        const moduleFilePath = path.join(basePath, `${moduleName}.module.ts`);
        const moduleFileContent = getModuleFileContent(moduleName);
        createFile(moduleFilePath, moduleFileContent.trim());

        if (options.crud) {
            const crudActions = ["create", "update", "delete"];
            const commandsPath = path.join(basePath, "application", "commands");
            const dtoPath = path.join(basePath, "application", "dto", "requests");
            const handlers = crudActions.map((action) => ({
                functionName: toPascalCase(`${action}-${moduleName}`),
                fileName: action,
            }));

            // Command Handler
            const commandFilePath = path.join(commandsPath, "index.ts");
            const commandFileContent = getIndexFileContent(moduleName, handlers);
            createFile(commandFilePath, commandFileContent.trim());


            crudActions.forEach((action) => {
                // Command
                const commandFilePath = path.join(
                    commandsPath,
                    `${action}-${moduleName}.command.ts`
                );
                const commandFileContent = getCommandFileContent(moduleName, action);
                const commandIndexFilePath = path.join(basePath, "application", "commands", `index.ts`);
                const importCommandName = toCamelCase(action) + toCamelCase(moduleName) + 'Handler';
                const importCommandLine = `import { ${importCommandName} } from "@modules/${moduleName}/application/commands/${moduleName}.command";\n`;
                createFile(commandFilePath, commandFileContent.trim());
                updateIndexFileGeneric(commandIndexFilePath, importCommandName, importCommandLine, 'CommandHandlers');
                // Use Case
                const useCaseFilePath = path.join(
                    basePath,
                    "application",
                    "domain",
                    "usecases",
                    `${action}-${moduleName}.use-case.ts`
                );
                const useCaseFileContent = getUseCaseFileContent(moduleName, action);
                const useCaseIndexFilePath = path.join(basePath, "application", "domain", "usecases", `index.ts`);
                const importUseCaseName = toCamelCase(action) + toCamelCase(moduleName) + 'UseCase';
                const importUseCaseLine = `import { ${importUseCaseName} } from "@modules/${moduleName}/application/domain/usecases/${moduleName}.use-case";\n`;
                createFile(useCaseFilePath, useCaseFileContent.trim());
                updateIndexFileGeneric(useCaseIndexFilePath, importUseCaseName, importUseCaseLine, 'UseCases');


                if (action !== 'delete') {
                    // DTO Request
                    const dtoRequestFilePath = path.join(
                        dtoPath,
                        `${action}-${moduleName}.dto.ts`
                    );
                    const nameCamelCase = toCamelCase(action + toCamelCase(moduleName));
                    const dtoRequestFileContent = getDtoRequestFileContent(nameCamelCase);
                    const dtoIndexFilePath = path.join(basePath, "application", "dto", "requests", `index.ts`);
                    const importDTOName = toCamelCase(action) + toCamelCase(moduleName) + 'Dto';
                    const importDTOLine = `import { ${importDTOName} } from "@modules/${moduleName}/application/domain/dto/requests/${moduleName}.dto";\n`;
                    createFile(dtoRequestFilePath, dtoRequestFileContent.trim());
                    updateIndexFileGeneric(dtoIndexFilePath, importDTOName, importDTOLine, 'Requests');

                }
            });

            // Queries
            const queriesFilePath = path.join(basePath, "application", "queries", `get-${moduleName}.query.ts`);
            const queriesByIdFilePath = path.join(basePath, "application", "queries", `get-${moduleName}-by-id.query.ts`);
            const queriesFileContent = getQueriesFileAllContent(moduleName);
            const queriesFileByIdContent = getQueriesFileOneContent(moduleName);
            const queriesIndexFilePath = path.join(basePath, "application", "queries", `index.ts`);
            const importQueryByIdName = "Get" +  toCamelCase(moduleName) + 'ByIdHandler';
            const importQueryName = "GetListOf" + toCamelCase(moduleName) + 'Handler';
            const importQueryLine = `import { ${importQueryName} } from "@modules/${moduleName}/application/queries/get-list-of-${moduleName}.query";\n`;
            const importQueryByIdLine = `import { ${importQueryByIdName} } from "@modules/${moduleName}/application/queries/get-${moduleName}-by-id.query";\n`;
            createFile(queriesFilePath, queriesFileContent.trim());
            createFile(queriesByIdFilePath, queriesFileByIdContent.trim());
            updateIndexFileGeneric(queriesIndexFilePath, importQueryName, importQueryLine, 'Queries');
            updateIndexFileGeneric(queriesIndexFilePath, importQueryByIdName, importQueryByIdLine, 'Queries');

            // Entity
            const entityFilePath = path.join(basePath, "application", "domain", "entities", `${moduleName}.entity.ts`);
            const entityFileContent = getEntityFileContent(toPascalCase(moduleName) + 'Entity');
            const entityIndexFilePath = path.join(basePath, "application", "domain", "entities", `index.ts`);
            const importEntityName = toCamelCase(moduleName) + 'Entity';
            const importEntityLine = `import { ${importEntityName} } from "@modules/${moduleName}/application/domain/entities/${moduleName}.entity";\n`;
            createFile(entityFilePath, entityFileContent.trim());
            updateIndexFileGeneric(entityIndexFilePath, importEntityName, importEntityLine, 'Entities');

            // Mapper
            const mapperFilePath = path.join(basePath, "infrastructures", "mappers", `${moduleName}.mapper.ts`);
            const mapperFileContent = getMapperFileContent(moduleName);
            const mapperIndexFilePath = path.join(basePath, "infrastructures", "mappers", `index.ts`);
            const importMapperName = toCamelCase(moduleName) + 'Mapper';
            const importMapperLine = `import { ${importMapperName} } from "@modules/${moduleName}/infrastructures/mappers/${moduleName}.mapper";\n`;
            createFile(mapperFilePath, mapperFileContent.trim());
            updateIndexFileGeneric(mapperIndexFilePath, importMapperName, importMapperLine, 'Mappers');

            // ORM Entity
            const ormEntityFilePath = path.join(basePath, "infrastructures", "orm-entities", `${moduleName}.orm-entity.ts`);
            const ormEntityIndexFilePath = path.join(basePath, "infrastructures", "orm-entities", `index.ts`);
            const ormEntityFileContent = getOrmEntityFileContent(moduleName);
            const importOrmEntityName = toCamelCase(moduleName) + 'OrmEntity';
            const importOrmEntityLine = `import { ${importOrmEntityName} } from "@modules/${moduleName}/infrastructures/orm-entities/${moduleName}.orm-entity";\n`;
            createFile(ormEntityFilePath, ormEntityFileContent.trim());
            updateIndexFileGeneric(ormEntityIndexFilePath, importOrmEntityName, importOrmEntityLine, 'OrmEntities');

            // Repository
            const repositoryFilePath = path.join(basePath, "infrastructures", "repositories", `${moduleName}.repository.ts`);
            const repositoryIndexFilePath = path.join(basePath, "infrastructures", "repositories", `index.ts`);
            const repositoryFileContent = getRepositoryFileContent(moduleName);
            const importRepositoryName = toCamelCase(moduleName) + 'Repository';
            const importRepositoryLine = `import { ${importRepositoryName} } from "@modules/${moduleName}/infrastructures/repositories/${moduleName}.repository";\n`;
            createFile(repositoryFilePath, repositoryFileContent.trim());
            updateIndexFileGeneric(repositoryIndexFilePath, importRepositoryName, importRepositoryLine, 'Repositories');

        }

        console.log("Architecture CQRS générée avec succès.");
    });

program.parse(process.argv);
