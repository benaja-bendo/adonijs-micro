import env from '#start/env'
import { KafkaConfig } from 'kafkajs'

/**
 * Configuration Kafka pour l'application
 */
const kafkaConfig: KafkaConfig & { logLevel?: string } = {
  brokers: env.get('KAFKA_BROKERS', 'localhost:9092').split(','),
  clientId: env.get('KAFKA_CLIENT_ID', 'micro-1'),
  logLevel: env.get('KAFKA_LOG_LEVEL', 'info'),
  // Décommentez et configurez si vous utilisez SSL
  // ssl: true,
  // Décommentez et configurez si vous utilisez SASL
  // sasl: {
  //   mechanism: 'plain',
  //   username: env.get('KAFKA_SASL_USERNAME'),
  //   password: env.get('KAFKA_SASL_PASSWORD'),
  // },
}

export default kafkaConfig
