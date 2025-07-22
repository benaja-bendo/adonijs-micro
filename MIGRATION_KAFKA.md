# Utilisation de kafkajs

## Résumé  

Utilisation du package  `kafkajs` dans les deux microservices AdonisJS.

## Changements effectués

### 1. Installation des dépendances

```bash
# Dans micro-1 et micro-2
npm install kafkajs
npm uninstall @neighbourhoodie/adonis-kafka
```

### 2. Nouveaux services créés

#### Services Kafka Standalone
- `micro-1/app/services/kafka_standalone_service.ts`
- `micro-2/app/services/kafka_standalone_service.ts`

Ces services fournissent une interface simplifiée pour :
- Envoyer des messages à Kafka
- Créer des consommateurs
- Gérer les connexions automatiquement

#### Services Kafka simplifiés
- Mise à jour de `KafkaService` dans les deux microservices
- Utilisation des services standalone pour simplifier le code

### 3. Configuration mise à jour

#### Fichiers de configuration Kafka
- `config/kafka.ts` dans les deux microservices
- Compatible avec kafkajs
- Support des brokers en array
- Configuration SSL/SASL commentée pour référence

#### Variables d'environnement
- `start/env.ts` dans les deux microservices
- Suppression des références à l'ancien package
- Validation simplifiée des variables Kafka

### 4. Fichiers de démarrage

#### start/kafka.ts
- Utilisation des services standalone
- Initialisation simplifiée des consommateurs
- Gestion d'erreurs améliorée

### 5. Contrôleurs

#### KafkaController (micro-1)
- Utilisation du service standalone
- API simplifiée pour l'envoi de messages

### 6. Configuration AdonisJS

#### adonisrc.ts
- Suppression des références aux providers Kafka personnalisés
- Configuration simplifiée

## Avantages de la migration

1. **Simplicité** : Plus besoin d'injection de dépendances complexe
2. **Performance** : kafkajs est plus léger et performant
3. **Maintenance** : Moins de code personnalisé à maintenir
4. **Flexibilité** : Configuration plus flexible de Kafka
5. **Documentation** : kafkajs est mieux documenté

## Utilisation

### Envoyer un message

```typescript
import KafkaStandaloneService from '#services/kafka_standalone_service'

// Envoyer un message
await KafkaStandaloneService.send('mon-topic', { message: 'Hello World' })
```

### Créer un consommateur

```typescript
import KafkaStandaloneService from '#services/kafka_standalone_service'

// Créer un consommateur
await KafkaStandaloneService.createConsumer(
  'mon-topic',
  'default-group',
  async (data) => {
    console.log('Message reçu:', data)
  }
)
```

### Utiliser le service KafkaService

```typescript
import KafkaService from '#services/kafka_service'

// Micro-1
await KafkaService.sendToMicro2({ action: 'test' })
await KafkaService.sendUserEvent({ userId: 1, action: 'login' })

// Micro-2
await KafkaService.sendToMicro1({ response: 'ok' })
await KafkaService.sendNotification({ message: 'Hello' })
```

## Configuration Kafka

Assurez-vous que les variables d'environnement suivantes sont définies :

```env
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=micro-1  # ou micro-2
KAFKA_LOG_LEVEL=info
```

## Tests

Les deux microservices démarrent correctement :
- **Micro-1** : http://localhost:3333
- **Micro-2** : http://localhost:55486

Les consommateurs Kafka se connectent automatiquement aux topics configurés.

## Topics utilisés

- `micro-1.events` : Messages de micro-1 vers micro-2
- `micro-2.events` : Messages de micro-2 vers micro-1
- `user.events` : Événements utilisateur
- `notification.events` : Notifications

## Prochaines étapes

1. Tester la communication entre les microservices
2. Ajouter des tests unitaires pour les services Kafka
3. Configurer la surveillance des consommateurs
4. Optimiser la configuration pour la production