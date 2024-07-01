import {toPascalCase, toCamelCase} from "./utils.js";

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

export const getDtoRequestFileContent = (moduleName) => {
    return `
import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, IsEmail } from "class-validator";

export class ${moduleName}Dto {
}
  `;
};

export const getEntityFileContent = (moduleName) => {
    return `
import { BaseDomainEntity } from "@core/entities/base-domain.entity";

export interface ${moduleName}Props {}

export class ${moduleName} extends BaseDomainEntity {

  constructor(props: ${moduleName}Props) {
    super();
    Object.assign(this, props);
  }
}
  `;
};

export const getUseCaseFileContent = (moduleName, action) => {
    const camelCaseModuleName = toCamelCase(moduleName);
    const camelCaseActionName = toCamelCase(action);
    return `
import { ${camelCaseModuleName}Entity } from "@modules/${moduleName}/application/domain/entities/${moduleName}.entity";
import { ${camelCaseModuleName}Repository } from "@modules/${moduleName}/infrastructure/repositories/${moduleName}.repository";
import { ${camelCaseActionName}${camelCaseModuleName}Command } from "@modules/${moduleName}/application/commands/${action}-${moduleName}.command";
import { Injectable } from "@nestjs/common";
@Injectable()
export class ${camelCaseActionName}${camelCaseModuleName}UseCase {
  constructor(private readonly repository: ${camelCaseModuleName}Repository) {}

  async execute(command: ${camelCaseActionName}${camelCaseModuleName}Command) {
    const ${moduleName} = new ${camelCaseModuleName}Entity(command);
    return this.repository.${action}(${moduleName});
  }
}
    `;
}

export const getQueriesFileAllContent = (moduleName) => {
    const camelCaseModuleName = toCamelCase(moduleName);
    return `
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ${camelCaseModuleName}Repository } from "@modules/${moduleName}/infrastructure/repositories/${moduleName}.repository";
export class GetListOf${camelCaseModuleName}Query {
 constructor() {}
 }
@QueryHandler(GetListOf${camelCaseModuleName}Query)
export class GetListOf${camelCaseModuleName}Handler
  implements IQueryHandler<GetListOf${camelCaseModuleName}Query>
{
  constructor(private readonly repository: ${camelCaseModuleName}Repository) {}

  async execute(query: GetListOf${camelCaseModuleName}Query) {
    return this.repository.findAll(query);
  }
}
    `;
}

export const getQueriesFileOneContent = (moduleName) => {
    const camelCaseModuleName = toCamelCase(moduleName);
    return `
import { ${camelCaseModuleName}Entity } from "@modules/${moduleName}/application/domain/entities/${moduleName}.entity";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ${camelCaseModuleName}Repository } from "@modules/${moduleName}/infrastructure/repositories/${moduleName}.repository";
export class Get${camelCaseModuleName}ByIdQuery {
 constructor(public readonly id: string) {}
 }
@QueryHandler(Get${camelCaseModuleName}ByIdQuery)
export class Get${camelCaseModuleName}ByIdHandler
  implements IQueryHandler<Get${camelCaseModuleName}ByIdQuery>
{
  constructor(private readonly repository: ${camelCaseModuleName}Repository) {}

  async execute(query: Get${camelCaseModuleName}ByIdQuery): Promise<${camelCaseModuleName}Entity> {
   const ${moduleName} = await this.repository.findById(query.id);
    if (!${moduleName}) {
      throw new Error("${camelCaseModuleName} not found");
    }
    return ${moduleName};
  }
}
    `;
}

export const getMapperFileContent = (moduleName) => {
    const camelCaseModuleName = toCamelCase(moduleName);
    return `
import { BaseMapper } from "@core/mappers/base.mapper";
import { VehicleEntity } from "@modules/${moduleName}/application/domain/entities/${moduleName}.entity";
import { VehicleOrmEntity } from "@modules/${moduleName}/infrastructure/orm-entities/${moduleName}.orm-entity";

export class ${camelCaseModuleName}Mapper extends BaseMapper<${camelCaseModuleName}Entity, ${camelCaseModuleName}OrmEntity> {
  constructor() {
    super();
  }
  toOrmEntity(domainEntity: ${camelCaseModuleName}Entity): ${camelCaseModuleName}OrmEntity {
    this.validateDomainEntity(domainEntity);

    const ormEntity = new ${camelCaseModuleName}OrmEntity(domainEntity.id);
    return ormEntity;
  }

  toDomainEntity(ormEntity: ${camelCaseModuleName}OrmEntity): ${camelCaseModuleName}Entity {
    return new ${camelCaseModuleName}Entity({
      id: ormEntity.id,
    });
  }
}
    `;
}

export const getOrmEntityFileContent = (moduleName) => {
    const camelCaseModuleName = toCamelCase(moduleName);
    return `
import { BaseOrmEntity } from "@core/infrastructure/persistence/orm-entities/base.orm-entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity("${moduleName}")
export class ${camelCaseModuleName}OrmEntity extends BaseOrmEntity {
}
    `;
}

export const getRepositoryFileContent = (moduleName, ...args) => {
    const anotherParam = args[0];
    const camelCaseModuleName = toCamelCase(moduleName);
    return `
import { ${camelCaseModuleName}Entity } from "@modules/${anotherParam ?? moduleName}/application/domain/entities/${moduleName}.entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ${camelCaseModuleName}OrmEntity } from "@modules/${anotherParam ?? moduleName}/infrastructure/orm-entities/${moduleName}.orm-entity";
import { Repository } from "typeorm";
import { ${camelCaseModuleName}Mapper } from "@modules/${anotherParam ?? moduleName}/infrastructure/mappers/${moduleName}.mapper";

@Injectable()
export class ${camelCaseModuleName}Repository {
  constructor(
    @InjectRepository(${camelCaseModuleName}OrmEntity)
    private ormRepository: Repository<${camelCaseModuleName}OrmEntity>,
    private mapper: ${camelCaseModuleName}Mapper,
  ) {}

  async findAll(): Promise<${camelCaseModuleName}Entity[]> {
    const ${moduleName}s = await this.ormRepository.find();
    if (!${moduleName}s) {
      return [];
    }
    return ${moduleName}s.map((${moduleName}: ${camelCaseModuleName}OrmEntity) =>
      this.mapper.toDomainEntity(${moduleName}),
    );
  }

  async findById(id: string): Promise<${camelCaseModuleName}Entity | null> {
    const ${moduleName} = await this.ormRepository
      .createQueryBuilder("${moduleName.charAt(0)}")
      .where("${moduleName.charAt(0)}.id = :id", { id })
      .getOne();

    if (!${moduleName}) {
      return null;
    }

    return this.mapper.toDomainEntity(${moduleName});
  }

  async remove(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }

  async create(data: ${camelCaseModuleName}Entity): Promise<${camelCaseModuleName}Entity> {
    const ${moduleName} = this.mapper.toOrmEntity(data);
    await this.ormRepository.save(${moduleName});
    return this.mapper.toDomainEntity(${moduleName});
  }

  async update(id: string, data: ${camelCaseModuleName}Entity): Promise<void> {
    const ${moduleName} = this.mapper.toOrmEntity(data);
    await this.ormRepository.update(id, ${moduleName});
  }

  async delete(id: number): Promise<void> {
    await this.ormRepository.delete(id);
  }
}
    
    `;
}


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
