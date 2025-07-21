import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'
import KafkaService from '#services/kafka_service'
import NotificationsController from '#controllers/notifications_controller'

// Initialisation du consommateur avec un groupId spécifique
const consumer = Kafka.createConsumer({ groupId: 'micro-2-group' })

// Écoute des événements utilisateur provenant de micro-1
consumer.on({ topic: 'user.events' }, async (data, commit, { heartbeat }) => {
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

    console.log('Message reçu sur le topic user.events:', parsedData)

    // Traitement du message par le contrôleur de notifications
    const notificationsController = new NotificationsController()
    await notificationsController.processUserEvent(parsedData)

    // Confirmer la réception du message
    commit() // ACK
  } catch (error) {
    console.error('Erreur lors du traitement du message:', error)
    // Ne pas commiter en cas d'erreur pour permettre un retraitement
  }
})

// Exemple d'utilisation du service Kafka pour écouter un autre topic
await KafkaService.listenToMicro1('micro-1.events', async (data) => {
  console.log('Message reçu sur le topic micro-1.events:', data)
  // Traitement spécifique pour ce topic
})

// Démarrage du consommateur principal
await consumer.start()

console.log('Kafka consumers started for micro-2')
