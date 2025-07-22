import KafkaStandaloneService from '#services/kafka_standalone_service'

export default class KafkaService {
  /**
   * Envoie un message vers micro-2
   */
  static async sendToMicro2(message: any, topic: string = 'micro-1.events'): Promise<void> {
    await KafkaStandaloneService.send(topic, message)
  }

  /**
   * Écoute les messages provenant de micro-2
   */
  static async listenToMicro2(topic: string, handler: (data: any) => Promise<void>): Promise<void> {
    await KafkaStandaloneService.createConsumer(topic, 'micro-1-micro2-listener', handler)
  }

  /**
   * Envoie un événement utilisateur
   */
  static async sendUserEvent(userEvent: any): Promise<void> {
    await KafkaStandaloneService.send('user.events', userEvent)
  }
}
