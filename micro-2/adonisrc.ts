import { defineConfig } from '@adonisjs/core/app'

export default defineConfig({
  /*
  |--------------------------------------------------------------------------
  | Commands
  |--------------------------------------------------------------------------
  |
  | List of ace commands to register. The application commands will be
  | scanned automatically from the "./commands" directory.
  |
  */
  commands: [() => import('@adonisjs/core/commands')],

  /*
  |--------------------------------------------------------------------------
  | Service providers
  |--------------------------------------------------------------------------
  |
  | List of service providers to register. The providers mentioned under
  | "providers" array will be registered during the application boot.
  |
  */
  providers: [() => import('@adonisjs/core/providers/app_provider')],

  /*
  |--------------------------------------------------------------------------
  | Preloads
  |--------------------------------------------------------------------------
  |
  | List of modules to import before starting the application.
  |
  */
  preloads: [() => import('#start/routes'), () => import('#start/kafka')],

  /*
  |--------------------------------------------------------------------------
  | Tests
  |--------------------------------------------------------------------------
  |
  | List of test suites to organize tests by their type. Feel free to remove
  | and add additional suites.
  |
  */
  tests: {
    suites: [
      {
        files: ['tests/unit/**/*.spec(.ts|.js)'],
        name: 'unit',
        timeout: 2000,
      },
      {
        files: ['tests/functional/**/*.spec(.ts|.js)'],
        name: 'functional',
        timeout: 30000,
      },
    ],
  },
})
