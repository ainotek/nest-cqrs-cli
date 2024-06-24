import { toPascalCase, toCamelCase } from "./utils.js";

export const getCommandFileContent = (moduleName, action) => {
  const pascalCaseModuleName = toPascalCase(moduleName);
  const camelCaseModuleName = toCamelCase(moduleName);

  return `
import { ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Dto } from "@modules/${moduleName}/application/dto/requests/${action}-${moduleName}.dto";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}UseCase } from "@modules/${moduleName}/application/domain/usecases/${action}-${moduleName}.use-case";
import {
  ${pascalCaseModuleName}Entity,
  ${pascalCaseModuleName}Type,
} from "@modules/${moduleName}/application/domain/entities/${moduleName}.entity";

export class ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Command {
  public exampleProperty: string;
  constructor(dto: ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Dto) {
    this.exampleProperty = dto.exampleProperty;
  }
}

@CommandHandler(${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Command)
export class ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Handler
  implements ICommandHandler<${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Command>
{
  constructor(private readonly ${camelCaseModuleName}UseCase: ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}UseCase) {}

  async execute(command: ${
    action.charAt(0).toUpperCase() + action.slice(1)
  }${pascalCaseModuleName}Command): Promise<${pascalCaseModuleName}Entity> {
    return this.${camelCaseModuleName}UseCase.execute(command);
  }
}
  `;
};

export const getIndexFileContent = (moduleName, handlers) => {
  return `
${handlers
  .map(
    (handler) =>
      `import { ${handler.functionName}Handler } from "@modules/${moduleName}/application/commands/${handler.fileName}-${moduleName}.command";`
  )
  .join("\n")}

export const CommandHandlers = [
  ${handlers.map((handler) => `${handler.functionName}Handler`).join(",\n  ")},
];
  `;
};

export const getModuleFileContent = (moduleName) => {
  const pascalCaseModuleName = toPascalCase(moduleName);

  return `
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CqrsModule } from "@nestjs/cqrs";
import { CommandHandlers } from "@modules/${moduleName}/application/commands";
import { OrmEntities } from "@modules/${moduleName}/infrastructures/orm-entities";
import { Queries } from "@modules/${moduleName}/application/queries";
import { Repositories } from "@modules/${moduleName}/infrastructures/repositories";
import { UseCases } from "@modules/${moduleName}/application/domain/usecases";
import { Mappers } from "@modules/${moduleName}/infrastructures/mappers";
import { Controllers } from "@modules/${moduleName}/application/controllers";

@Module({
  imports: [TypeOrmModule.forFeature([...OrmEntities]), CqrsModule],
  providers: [
    ...CommandHandlers,
    ...Queries,
    ...Repositories,
    ...Mappers,
    ...UseCases,
  ],
  controllers: [...Controllers],
})
export class ${pascalCaseModuleName}Module {}
`;
};
