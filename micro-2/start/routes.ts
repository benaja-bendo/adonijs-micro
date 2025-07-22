/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const notificationsController = () => import('#controllers/notifications_controller')
const producersController = () => import('#controllers/producers_controller')
const consumersController = () => import('#controllers/consumers_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

// Routes pour le producteur Kafka
router.post('/api/kafka/send', [producersController, 'sendMessage'])

// Routes pour le consommateur Kafka
router.post('/api/kafka/consume', [consumersController, 'setupConsumer'])
router.get('/api/kafka/consumers', [consumersController, 'getConsumerStatus'])

// Routes pour les notifications
router.post('/api/notifications/send', [notificationsController, 'sendNotification'])
