import type { HttpContext } from '@adonisjs/core/http'
import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'

export default class KafkaController {
  /**
   * Envoie un message à micro-2 via Kafka
   */
  public async sendToMicro2({ request, response }: HttpContext) {
    const { message, topic = 'micro-1.events' } = request.only(['message', 'topic'])

    if (!message) {
      return response.badRequest('Message is required')
    }

    try {
      // Envoi du message au topic spécifié (par défaut 'micro-1.events')
      await Kafka.producer().send({
        topic,
        messages: [{ value: message }],
      })

      return response.ok({ 
        status: 'Message sent successfully to micro-2',
        details: { topic, message }
      })
    } catch (error) {
      console.error('Error sending message to micro-2:', error)
      return response.internalServerError('Failed to send message to micro-2')
    }
  }

  /**
   * Récupère l'état des consommateurs Kafka
   */
  public async getKafkaStatus({ response }: HttpContext) {
    // Ceci est une simulation - dans une application réelle, vous devriez suivre l'état des consommateurs
    return response.ok({
      consumers: [
        { topic: 'micro-2.events', groupId: 'micro-1-group', status: 'active' },
        // Ajoutez d'autres consommateurs selon vos besoins
      ],
      producers: [
        { status: 'active' }
      ]
    })
  }
}