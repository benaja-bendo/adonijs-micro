/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const kafkaController = () => import('#controllers/kafka_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Routes pour la communication Kafka avec micro-2
router.post('/api/kafka/send-to-micro2', [kafkaController, 'sendToMicro2'])
router.get('/api/kafka/status', [kafkaController, 'getKafkaStatus'])
