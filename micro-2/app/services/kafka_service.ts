import KafkaStandaloneService from '#services/kafka_standalone_service'

export default class KafkaService {
  /**
   * Envoie un message vers micro-1
   */
  static async sendToMicro1(message: any, topic: string = 'micro-2.events'): Promise<void> {
    await KafkaStandaloneService.send(topic, message)
  }

  /**
   * Écoute les messages provenant de micro-1
   */
  static async listenToMicro1(topic: string, handler: (data: any) => Promise<void>): Promise<void> {
    await KafkaStandaloneService.createConsumer(topic, 'micro-2-micro1-listener', handler)
  }

  /**
   * Envoie une notification
   */
  static async sendNotification(notification: any): Promise<void> {
    await KafkaStandaloneService.send('notification.events', notification)
  }
}
