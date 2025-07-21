import type { HttpContext } from '@adonisjs/core/http'
import Kafka from '@neighbourhoodie/adonis-kafka/services/kafka'

export default class ProducersController {
  public async sendMessage({ request, response }: HttpContext) {
    const { topic, message } = request.only(['topic', 'message'])

    if (!topic || !message) {
      return response.badRequest('Topic and message are required')
    }

    try {
      await Kafka.producer().send({
        topic,
        messages: [{ value: message }],
      })

      return response.ok({ status: 'Message sent successfully' })
    } catch (error) {
      console.error('Error sending message:', error)
      return response.internalServerError('Failed to send message')
    }
  }
