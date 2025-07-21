import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'

export default class KafkaService {
  /**
   * Envoie un message à micro-2 via Kafka
   * @param topic Le topic sur lequel envoyer le message
   * @param message Le message à envoyer
   */
  public static async sendToMicro2(topic: string, message: any): Promise<void> {
    // Convertir le message en chaîne JSON si c'est un objet
    const messageValue = typeof message === 'object' ? JSON.stringify(message) : message

    await Kafka.producer().send({
      topic,
      messages: [{ value: messageValue }],
    })

    console.log(`Message envoyé à micro-2 sur le topic ${topic}:`, message)
  }

  /**
   * Initialise un consommateur pour écouter les messages de micro-2
   * @param topic Le topic à écouter
   * @param handler La fonction de traitement des messages
   * @param groupId L'ID du groupe de consommateurs
   */
  public static async listenToMicro2(
    topic: string,
    handler: (data: any) => Promise<void>,
    groupId: string = 'micro-1-group'
  ): Promise<void> {
    const consumer = Kafka.createConsumer({ groupId })

    consumer.on({ topic }, async (data, commit, { heartbeat }) => {
      await heartbeat() // évite l'expiration du leasing
      
      try {
        // Essayer de parser le message comme JSON si c'est une chaîne
        let parsedData = data
        if (typeof data === 'string') {
          try {
            parsedData = JSON.parse(data)
          } catch (e) {
            // Si le parsing échoue, utiliser la donnée brute
            parsedData = data
          }
        }

        // Appeler le gestionnaire fourni
        await handler(parsedData)
        
        // Confirmer la réception du message
        commit()
      } catch (error) {
        console.error(`Erreur lors du traitement du message sur le topic ${topic}:`, error)
        // Ne pas commiter en cas d'erreur pour permettre un retraitement
      }
    })

    await consumer.start()
    console.log(`Consommateur Kafka démarré pour le topic ${topic} avec le groupe ${groupId}`)
  }

  /**
   * Exemple d'utilisation du service pour envoyer un événement utilisateur
   * @param userId L'ID de l'utilisateur
   * @param action L'action effectuée
   * @param data Les données associées à l'action
   */
  public static async sendUserEvent(userId: number, action: string, data: any = {}): Promise<void> {
    const event = {
      userId,
      action,
      data,
      timestamp: new Date().toISOString(),
    }

    await this.sendToMicro2('user.events', event)
  }
}