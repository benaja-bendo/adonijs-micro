# Communication entre microservices avec AdonisJS et Kafka

Ce projet démontre comment mettre en place une communication entre deux microservices AdonisJS en utilisant Kafka.

## Structure du projet

- **micro-1** : Premier microservice
- **micro-2** : Second microservice

## Prérequis

- Node.js (v16+)
- AdonisJS
- Kafka (vous pouvez utiliser Docker pour le déployer facilement)

## Configuration

### Installation de Kafka

Vous pouvez utiliser Docker pour démarrer rapidement Kafka :

```bash
docker-compose up -d
```

Voici un exemple de fichier `docker-compose.yml` pour Kafka :

```yaml
version: '3'
services:
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
    environment:
      ZOOKEEPER_CLIENT_PORT: 2181
    ports:
      - "2181:2181"

  kafka:
    image: confluentinc/cp-kafka:latest
    depends_on:
      - zookeeper
    ports:
      - "9092:9092"
    environment:
      KAFKA_BROKER_ID: 1
      KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
      KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092
      KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR: 1
```

### Configuration des microservices

1. Copiez le fichier `.env.example` vers `.env` dans chaque microservice :

```bash
cp micro-1/.env.example micro-1/.env
cp micro-2/.env.example micro-2/.env
```

2. Assurez-vous que la variable `KAFKA_BROKERS` est correctement configurée dans les deux fichiers `.env`.

## Démarrage des microservices

1. Installez les dépendances pour chaque microservice :

```bash
cd micro-1
npm install

cd ../micro-2
npm install
```

2. Démarrez les microservices :

```bash
# Dans un terminal
cd micro-1
node ace serve --watch

# Dans un autre terminal
cd micro-2
node ace serve --watch
```

## Utilisation de l'API

### Envoyer un message de micro-1 à micro-2

```bash
curl -X POST http://localhost:3333/api/kafka/send-to-micro2 \
  -H "Content-Type: application/json" \
  -d '{"message": {"userId": 1, "action": "user_created", "data": {"fullName": "John Doe"}}, "topic": "user.events"}'
```

### Envoyer une notification de micro-2 à micro-1

```bash
curl -X POST http://localhost:3334/api/notifications/send \
  -H "Content-Type: application/json" \
  -d '{"userId": 1, "type": "info", "content": "Ceci est une notification de test"}'
```

## Architecture de communication

### Topics Kafka

- `user.events` : Événements utilisateur envoyés de micro-1 à micro-2
- `notification.events` : Notifications envoyées de micro-2 à micro-1
- `micro-1.events` : Autres événements envoyés de micro-1 à micro-2
- `micro-2.events` : Autres événements envoyés de micro-2 à micro-1

### Flux de communication

1. **micro-1** envoie un événement utilisateur à **micro-2** via le topic `user.events`
2. **micro-2** traite l'événement et peut envoyer une notification à **micro-1** via le topic `notification.events`
3. **micro-1** reçoit la notification et la traite

## Structure du code

### micro-1

- `app/controllers/kafka_controller.ts` : Contrôleur pour envoyer des messages à micro-2
- `app/services/kafka_service.ts` : Service pour gérer la communication Kafka
- `start/kafka.ts` : Initialisation des consommateurs Kafka

### micro-2

- `app/controllers/producers_controller.ts` : Contrôleur pour envoyer des messages génériques
- `app/controllers/consumers_controller.ts` : Contrôleur pour configurer les consommateurs
- `app/controllers/notifications_controller.ts` : Contrôleur pour envoyer des notifications
- `app/services/kafka_service.ts` : Service pour gérer la communication Kafka
- `start/kafka.ts` : Initialisation des consommateurs Kafka

## Bonnes pratiques

1. **Gestion des erreurs** : Toujours gérer les erreurs lors de l'envoi et de la réception des messages
2. **Validation des messages** : Valider les messages avant de les traiter
3. **Idempotence** : Concevoir les traitements pour être idempotents (pouvoir être exécutés plusieurs fois sans effet secondaire)
4. **Monitoring** : Mettre en place un monitoring des consommateurs et producteurs Kafka