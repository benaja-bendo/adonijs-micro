import { Kafka, Consumer, Producer } from 'kafkajs'
import kafkaConfig from '#config/kafka'

/**
 * Service Kafka standalone pour micro-1
 * Utilise kafkajs directement sans injection de dépendances
 */
class KafkaStandaloneService {
  private kafka: Kafka
  private producer: Producer | null = null
  private consumers: Map<string, Consumer> = new Map()

  constructor() {
    this.kafka = new Kafka({
      clientId: kafkaConfig.clientId || 'micro-1',
      brokers: Array.isArray(kafkaConfig.brokers)
        ? kafkaConfig.brokers
        : kafkaConfig.brokers.split(','),
      ssl: kafkaConfig.ssl,
      sasl: kafkaConfig.sasl,
      logLevel: this.getLogLevel(kafkaConfig.logLevel),
    })
  }

  /**
   * Obtient ou crée un producteur
   */
  private async getProducer(): Promise<Producer> {
    if (!this.producer) {
      this.producer = this.kafka.producer()
      await this.producer.connect()
    }
    return this.producer
  }

  /**
   * Envoie un message à un topic
   */
  async send(topic: string, message: any): Promise<void> {
    const producer = await this.getProducer()
    const messageValue = typeof message === 'object' ? JSON.stringify(message) : message

    await producer.send({
      topic,
      messages: [{ value: messageValue }],
    })

    console.log(`Message envoyé sur le topic ${topic}:`, message)
  }

  /**
   * Crée un consommateur pour un topic
   */
  async createConsumer(
    topic: string,
    groupId: string,
    handler: (data: any) => Promise<void>
  ): Promise<void> {
    const consumer = this.kafka.consumer({ groupId })

    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning: false })

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const messageValue = message.value?.toString()
          if (!messageValue) return

          let parsedData
          try {
            parsedData = JSON.parse(messageValue)
          } catch (e) {
            parsedData = messageValue
          }

          await handler(parsedData)
        } catch (error) {
          console.error(`Erreur lors du traitement du message sur le topic ${topic}:`, error)
        }
      },
    })

    this.consumers.set(`${topic}-${groupId}`, consumer)
    console.log(`Consommateur Kafka démarré pour le topic ${topic} avec le groupe ${groupId}`)
  }

  /**
   * Ferme toutes les connexions
   */
  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect()
      this.producer = null
    }

    for (const consumer of this.consumers.values()) {
      await consumer.disconnect()
    }
    this.consumers.clear()
  }

  /**
   * Convertit le niveau de log en niveau de log de kafkajs
   */
  private getLogLevel(logLevel?: string) {
    const levels = {
      error: 1,
      warn: 2,
      info: 4,
      debug: 5,
    }

    return levels[logLevel as keyof typeof levels] || levels.info
  }
}

// Export d'une instance singleton
export default new KafkaStandaloneService()
