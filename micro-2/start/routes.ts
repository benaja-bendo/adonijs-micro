/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const notifications_controller = () => import('#controllers/notifications_controller')
const producers_controller = () => import('#controllers/producers_controller')
const consumers_controller = () => import('#controllers/consumers_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Routes pour le producteur Kafka
router.post('/api/kafka/send', [producers_controller, 'sendMessage'])

// Routes pour le consommateur Kafka
router.post('/api/kafka/consume', [consumers_controller, 'setupConsumer'])
router.get('/api/kafka/consumers', [consumers_controller, 'getConsumerStatus'])

// Routes pour les notifications
router.post('/api/notifications/send', [notifications_controller, 'sendNotification'])
