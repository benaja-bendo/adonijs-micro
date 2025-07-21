import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'
import KafkaService from '#services/kafka_service'

// Initialisation du consommateur avec un groupId spécifique
const consumer = Kafka.createConsumer({ groupId: 'micro-1-group' })

// Écoute des notifications provenant de micro-2
consumer.on({ topic: 'notification.events' }, async (data, commit, { heartbeat }) => {
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

    console.log('Notification reçue de micro-2:', parsedData)

    // Ici, vous pouvez ajouter votre logique métier pour traiter la notification
    // Par exemple, sauvegarder dans la base de données, envoyer un email, etc.

    // Confirmer la réception du message
    commit() // ACK
  } catch (error) {
    console.error('Erreur lors du traitement de la notification:', error)
    // Ne pas commiter en cas d'erreur pour permettre un retraitement
  }
})

// Exemple d'utilisation du service Kafka pour écouter un autre topic
await KafkaService.listenToMicro2('micro-2.events', async (data) => {
  console.log('Message reçu sur le topic micro-2.events:', data)
  // Traitement spécifique pour ce topic
})

// Démarrage du consommateur principal
await consumer.start()

console.log('Kafka consumers started for micro-1')
