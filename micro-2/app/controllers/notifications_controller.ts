import type { HttpContext } from '@adonisjs/core/http'
import KafkaService from '#services/kafka_service'

export default class NotificationsController {
  /**
   * Envoie une notification à un utilisateur via Kafka
   */
  public async sendNotification({ request, response }: HttpContext) {
    const { userId, type, content } = request.only(['userId', 'type', 'content'])

    if (!userId || !type || !content) {
      return response.badRequest('UserId, type and content are required')
    }

    try {
      // Utilisation du service Kafka pour envoyer la notification
      await KafkaService.sendNotification(Number(userId), type, content)

      return response.ok({ 
        status: 'Notification sent successfully',
        details: { userId, type, content }
      })
    } catch (error) {
      console.error('Error sending notification:', error)
      return response.internalServerError('Failed to send notification')
    }
  }

  /**
   * Exemple de méthode qui pourrait être appelée par un consommateur Kafka
   * lorsqu'un événement utilisateur est reçu de micro-1
   */
  public async processUserEvent(event: any) {
    console.log('Processing user event:', event)
    
    // Exemple de logique métier basée sur l'événement reçu
    if (event.action === 'user_created') {
      // Envoyer une notification de bienvenue
      await KafkaService.sendNotification(
        event.userId,
        'welcome',
        `Bienvenue ${event.data.fullName || 'nouvel utilisateur'} !`
      )
    } else if (event.action === 'user_updated') {
      // Envoyer une notification de mise à jour
      await KafkaService.sendNotification(
        event.userId,
        'info',
        'Votre profil a été mis à jour avec succès.'
      )
    }
    
    // Autres traitements possibles...
  }
}