# CLI pour générer une architecture CQRS avec NestJS

Ce projet est un CLI (Command Line Interface) pour générer des fichiers et une structure de projet respectant l'architecture CQRS avec NestJS. Il permet de créer des modules, des commandes, des use cases, des entités, des contrôleurs, des repositories, des DTOs, des queries, des mappers et des ORM entities.

## Installation

Pour installer ce package, utilisez npm :

```bash
npm install -g nestjs-cqrs-cli
```

## Utilisation

### Générer la structure d'un module

Pour générer la structure de base d'un module, utilisez la commande suivante :

```bash
npx nestjs-cqrs-cli create-structure <nom-du-module> [--crud]
```

- `<nom-du-module>` : nom du module à générer
- `--crud` : optionnel, indique si le module doit être créé avec les commandes CRUD (Create, Read, Update, Delete)

Exemple :

```bash
npx nestjs-cqrs-cli create-structure users
```

Cela générera le module `users` avec les commandes CRUD.

### Créer une commande

Pour créer une nouvelle commande, utilisez :

```bash
npx nestjs-cqrs-cli create-command <nom-de-la-commande> <nom-du-module>
```

- `<nom-de-la-commande>` : nom de la commande
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-command createUser users
```

Cela créera une commande `createUser` dans le module `users`.

### Créer une use case

Pour créer une nouvelle use case, utilisez :

```bash
npx nestjs-cqrs-cli create-use-case <nom-de-la-use-case> <nom-du-module>
```

- `<nom-de-la-use-case>` : nom de la use case
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-use-case createUser users
```

Cela créera une use case `createUser` dans le module `users`.

### Créer une entité

Pour créer une nouvelle entité, utilisez :

```bash
npx nestjs-cqrs-cli create-entity <nom-de-l'entité> <nom-du-module>
```

- `<nom-de-l'entité>` : nom de l'entité
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-entity User users
```

Cela créera une entité `User` dans le module `users`.

### Créer un contrôleur

Pour créer un nouveau contrôleur, utilisez :

```bash
npx nestjs-cqrs-cli create-controller <nom-du-contrôleur> <nom-du-module>
```

- `<nom-du-contrôleur>` : nom du contrôleur
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-controller UserController users
```

Cela créera un contrôleur `UserController` dans le module `users`.

### Créer un repository

Pour créer un nouveau repository, utilisez :

```bash
npx nestjs-cqrs-cli create-repository <nom-du-repository> <nom-du-module>
```

- `<nom-du-repository>` : nom du repository
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-repository UserRepository users
```

Cela créera un repository `UserRepository` dans le module `users`.

### Créer un mapper

Pour créer un nouveau mapper, utilisez :

```bash
npx nestjs-cqrs-cli create-mapper <nom-du-mapper> <nom-du-module>
```

- `<nom-du-mapper>` : nom du mapper
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-mapper UserMapper users
```

Cela créera un mapper `UserMapper` dans le module `users`.

### Créer un ORM entity

Pour créer un nouveau ORM entity, utilisez :

```bash
npx nestjs-cqrs-cli create-orm-entity <nom-de-l'entité> <nom-du-module>
```

- `<nom-de-l'entité>` : nom de l'entité
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-orm-entity User users
```

Cela créera un ORM entity `User` dans le module `users`.

### Créer un query

Pour créer un nouveau query, utilisez :

```bash
npx nestjs-cqrs-cli create-query <nom-du-query> <nom-du-module>
```

- `<nom-du-query>` : nom du query
- `<nom-du-module>` : nom du module

Exemple :

```bash
npx nestjs-cqrs-cli create-query getUserByEmail users
```

Cela créera un query `getUserByEmail` dans le module `users`.

### Structure du projet

Le projet généré par ce CLI est composé de plusieurs fichiers :

- src/
  - modules/
    - <nom-du-module>/
      - application/
        - commands/
        - controllers/
        - domain/
          - entities/
          - events/
          - usecases/
        - dto/
          - requests/
          - responses/
        - queries/
      - infrastructures/
        - mappers/
        - orm-entities/
        - repositories/


## Contributions

Les contributions sont les bienvenues ! Pour contribuer, veuillez ouvrir une pull request.

## Licence

Ce projet est sous licence MIT.