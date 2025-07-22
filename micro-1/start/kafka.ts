import KafkaStandaloneService from '#services/kafka_standalone_service'
import KafkaService from '#services/kafka_service'

// Initialisation du consommateur pour les événements de micro-2
await KafkaStandaloneService.createConsumer('micro-2.events', 'micro-1-group', async (data) => {
  console.log('Message reçu sur le topic micro-2.events:', data)
  // Traitement spécifique pour les messages de micro-2
})

// Exemple d'utilisation du service Kafka pour écouter un autre topic
await KafkaService.listenToMicro2('notification.events', async (data) => {
  console.log('Message reçu sur le topic notification.events:', data)
  // Traitement spécifique pour les notifications
})

console.log('Kafka consumers started for micro-1')
