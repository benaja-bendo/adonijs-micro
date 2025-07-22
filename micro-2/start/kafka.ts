import KafkaStandaloneService from '#services/kafka_standalone_service'
import KafkaService from '#services/kafka_service'
import NotificationsController from '#controllers/notifications_controller'

// Initialisation du consommateur pour les événements utilisateur
await KafkaStandaloneService.createConsumer('user.events', 'micro-2-group', async (data) => {
  console.log('Message reçu sur le topic user.events:', data)

  // Traitement du message par le contrôleur de notifications
  const notificationsController = new NotificationsController()
  await notificationsController.processUserEvent(data)
})

// Exemple d'utilisation du service Kafka pour écouter un autre topic
await KafkaService.listenToMicro1('micro-1.events', async (data) => {
  console.log('Message reçu sur le topic micro-1.events:', data)
  // Traitement spécifique pour ce topic
})

console.log('Kafka consumers started for micro-2')
