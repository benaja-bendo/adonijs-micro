/*
|--------------------------------------------------------------------------
| Environment variables service
|--------------------------------------------------------------------------
|
| The `Env.create` method creates an instance of the Env service. The
| service validates the environment variables and also cast values
| to JavaScript data types.
|
*/

import { Env } from '@adonisjs/core/env'
import { KafkaEnv } from '@neighbourhoodie/adonis-kafka/env'

export default await Env.create(new URL('../', import.meta.url), {
  NODE_ENV: Env.schema.enum(['development', 'production', 'test'] as const),
  PORT: Env.schema.number(),
  APP_KEY: Env.schema.string(),
  HOST: Env.schema.string({ format: 'host' }),
  LOG_LEVEL: Env.schema.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace']),

  /*
  |----------------------------------------------------------
  | Variables for configuring kafka package
  |----------------------------------------------------------
  */
  KAFKA_BROKERS: KafkaEnv.schema.brokers(),
  KAFKA_CLIENT_ID: Env.schema.string.optional(),
  KAFKA_GROUP_ID: Env.schema.string.optional(),
  KAFKA_CONNECTION_TIMEOUT: Env.schema.number.optional(),
  KAFKA_REQUEST_TIMEOUT: Env.schema.number.optional(),
  KAFKA_LOG_LEVEL: Env.schema.enum.optional(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
})
