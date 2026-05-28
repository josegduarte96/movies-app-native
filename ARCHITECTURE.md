# Arquitectura — Clean Architecture

## Regla de dependencias

Las flechas apuntan **solo hacia adentro**. Una capa nunca importa de una capa más externa.

```mermaid
flowchart LR
    app["app/<br/>(rutas expo-router)"]
    presentation["presentation/<br/>(hooks React Query, providers)"]
    config["config/<br/>(composition root)"]
    infra["infrastructure/<br/>(adapters, mappers, repos, tipos API)"]
    core["core/<br/>(entities, use-cases, ports)"]

    app --> presentation
    presentation --> config
    presentation --> core
    config --> infra
    infra --> core

    classDef inner fill:#1d4ed8,stroke:#1e3a8a,color:#fff
    classDef outer fill:#0f766e,stroke:#134e4a,color:#fff
    class core inner
    class app,presentation,config,infra outer
```

- **core** = corazón. Cero dependencias externas. Solo TypeScript puro.
- **infrastructure** depende de core (implementa sus ports).
- **config** = composition root: crea instancias concretas y las cablea.
- **presentation** = estado de UI (React Query). Los hooks envuelven use-cases; nunca acceden a infrastructure directo.
- **app** = rutas expo-router; consumen hooks de presentation.

## Flujo de "now playing" (port pattern)

```mermaid
flowchart TD
    UI["app/_layout.tsx"]
    CFG["config/movieApi.ts<br/>movieRepository = new MovieDBRepository(axios)"]
    UC["core/use-cases<br/>nowPlayingUseCase(repo)"]
    PORT["core/repositories<br/>MovieRepository (abstract)"]
    IMPL["infrastructure/repositories<br/>MovieDBRepository"]
    HTTP["core/adapters<br/>HttpAdapter (abstract)"]
    AXIOS["infrastructure/adapters<br/>AxiosAdapter"]
    MAP["infrastructure/mappers<br/>MovieMapper"]
    ENT["core/entities<br/>Movie"]

    UI -->|llama| UC
    UI -->|inyecta| CFG
    CFG -->|crea| IMPL
    UC -->|depende de| PORT
    IMPL -.implementa.-> PORT
    IMPL --> HTTP
    AXIOS -.implementa.-> HTTP
    IMPL --> MAP
    MAP --> ENT
    PORT --> ENT

    classDef core fill:#1d4ed8,stroke:#1e3a8a,color:#fff
    classDef infra fill:#0f766e,stroke:#134e4a,color:#fff
    class UC,PORT,HTTP,ENT core
    class IMPL,AXIOS,MAP infra
```

Clave: `nowPlayingUseCase` depende del **port** `MovieRepository` (abstracción en core),
no de la implementación concreta. Cambiar de TMDB a otra API = nueva impl del port; core no se toca.

## Verificación automática

```bash
pnpm arch          # valida regla de dependencias; falla si hay violación
pnpm arch:graph:md # genera dependency-graph.mmd (Mermaid, sin deps externas)
pnpm arch:graph    # genera dependency-graph.svg (requiere Graphviz: sudo apt install graphviz)
```

El grafo real de módulos (autogenerado) vive en `dependency-graph.mmd`.
