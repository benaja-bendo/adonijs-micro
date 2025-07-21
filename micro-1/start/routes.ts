/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Routes pour la communication Kafka avec micro-2
router.post('/api/kafka/send-to-micro2', 'kafka_controller.sendToMicro2')
router.get('/api/kafka/status', 'kafka_controller.getKafkaStatus')
