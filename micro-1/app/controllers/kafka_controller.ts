import type { HttpContext } from '@adonisjs/core/http'
import KafkaStandaloneService from '#services/kafka_standalone_service'

export default class KafkaController {
  /**
   * Envoie un message vers micro-2
   */
  async sendToMicro2({ request, response }: HttpContext) {
    try {
      const body = await request.body()

      const message = body.message || 'Message par défaut' + Math.random().toString()
      const topic = body.topic || 'micro-1.events'

      if (!message) {
        return response.badRequest({ error: 'Le message est requis' })
      }
      await KafkaStandaloneService.send(topic, message)

      return response.ok({
        success: true,
        message: 'Message envoyé avec succès',
        data: { topic, message },
      })
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      return response.internalServerError({
        error: "Erreur lors de l'envoi du message",
      })
    }
  }

  /**
   * Obtient le statut de Kafka (simulation)
   */
  async getKafkaStatus({ response }: HttpContext) {
    // Simulation du statut Kafka
    const status = {
      producer: {
        connected: true,
        status: 'healthy',
      },
      consumer: {
        connected: true,
        status: 'healthy',
        groupId: 'micro-1-group',
      },
      topics: ['micro-1.events', 'user.events', 'notification.events'],
    }

    return response.ok(status)
  }
}
