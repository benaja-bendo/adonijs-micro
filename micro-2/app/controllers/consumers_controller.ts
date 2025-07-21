import type { HttpContext } from '@adonisjs/core/http'
import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'

export default class ConsumersController {
  /**
   * Cette méthode initialise un consommateur pour un topic spécifique
   * Elle est utilisée pour démontrer comment configurer un consommateur via une API
   */
  public async setupConsumer({ request, response }: HttpContext) {
    const { topic, groupId } = request.only(['topic', 'groupId'])

    if (!topic) {
      return response.badRequest('Topic is required')
    }

    try {
      // Créer un consommateur avec un groupId spécifique ou utiliser 'default'
      const consumer = Kafka.createConsumer({ groupId: groupId || 'default' })

      // Configurer le gestionnaire d'événements pour le topic
      consumer.on({ topic }, async (data, commit, { heartbeat }) => {
        // Éviter l'expiration du leasing
        await heartbeat()

        // Traitement du message reçu
        console.log(`Message reçu sur le topic ${topic}:`, data)

        // Ici, vous pouvez ajouter votre logique métier pour traiter le message
        // Par exemple, sauvegarder dans la base de données, déclencher d'autres actions, etc.

        // Confirmer la réception du message
        commit()
      })

      // Démarrer le consommateur
      await consumer.start()

      return response.ok({
        status: 'Consumer setup successfully',
        details: { topic, groupId: groupId || 'default' }
      })
    } catch (error) {
      console.error('Error setting up consumer:', error)
      return response.internalServerError('Failed to setup consumer')
    }
  }

  /**
   * Cette méthode simule la récupération de l'état des consommateurs
   * Dans une application réelle, vous pourriez stocker et gérer l'état des consommateurs
   */
  public async getConsumerStatus({ response }: HttpContext) {
    // Ceci est une simulation - dans une application réelle, vous devriez suivre l'état des consommateurs
    return response.ok({
      consumers: [
        { topic: 'user.events', groupId: 'default', status: 'active' },
        // Ajoutez d'autres consommateurs selon vos besoins
      ]
    })
  }
}
