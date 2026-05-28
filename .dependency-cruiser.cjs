/**
 * Reglas de Clean Architecture.
 * Regla de dependencias: las flechas apuntan SOLO hacia adentro.
 *
 *   app  ->  config  ->  infrastructure  ->  core
 *   (externa)                                 (interna)
 *
 * Una capa nunca puede importar de una capa mas externa.
 * Docs: https://github.com/sverweij/dependency-cruiser/blob/main/doc/rules-reference.md
 */
module.exports = {
  forbidden: [
    {
      name: 'core-no-deps-externas',
      comment:
        'core (entities, use-cases, ports) es la capa interna. No puede importar de ninguna capa externa. Define un port en core e impleméntalo afuera.',
      severity: 'error',
      from: { path: '^core/' },
      to: { path: '^(infrastructure|config|presentation|app)/' },
    },
    {
      name: 'infra-no-deps-externas',
      comment:
        'infrastructure solo puede mirar hacia core. No puede importar de config, presentation ni app.',
      severity: 'error',
      from: { path: '^infrastructure/' },
      to: { path: '^(config|presentation|app)/' },
    },
    {
      name: 'config-no-deps-externas',
      comment:
        'config (composition root) cablea infra+core. No puede depender de presentation ni app (UI).',
      severity: 'error',
      from: { path: '^config/' },
      to: { path: '^(presentation|app)/' },
    },
    {
      name: 'presentation-no-deps-externas',
      comment:
        'presentation (hooks React Query, providers) consume use-cases (core) y el repo cableado (config). No accede a infrastructure directo, ni importa rutas de app.',
      severity: 'error',
      from: { path: '^presentation/' },
      to: { path: '^(infrastructure|app)/' },
    },
    {
      name: 'no-circular',
      comment: 'Dependencias circulares rompen la separacion de capas.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-orphans',
      comment: 'Modulo sin usar ni usar a nadie. Posible codigo muerto.',
      severity: 'warn',
      from: { orphan: true, pathNot: ['\\.d\\.ts$', '(^|/)tailwind\\.config\\.', '(^|/)metro\\.config\\.', '(^|/)babel\\.config\\.'] },
      to: {},
    },
  ],
  options: {
    doNotFollow: { path: 'node_modules' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.json' },
    enhancedResolveOptions: {
      exportsFields: ['exports'],
      conditionNames: ['import', 'require', 'node', 'default', 'types'],
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },
    reporterOptions: {
      dot: { collapsePattern: 'node_modules/(?:@[^/]+/[^/]+|[^/]+)' },
      archi: {
        collapsePattern:
          '^(core|infrastructure|config|app)/[^/]+',
      },
    },
  },
};
