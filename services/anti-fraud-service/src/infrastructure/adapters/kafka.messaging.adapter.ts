import { Injectable, OnModuleInit } from "@nestjs/common";
import { Kafka, logLevel, Consumer } from "kafkajs";

@Injectable()
export class KafkaMessagingAdapter implements OnModuleInit {
  private kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || "anti-fraud-service",
    brokers: (process.env.KAFKA_BROKERS || "127.0.0.1:9092").split(","),
    logLevel: logLevel.NOTHING,
  });

  private producer = this.kafka.producer();
  private consumers = new Map<string, Consumer>();

  async onModuleInit() {
    await this.producer.connect();
  }

  async publish(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribe(
    topic: string,
    onMessage: (payload: any) => Promise<void>
  ): Promise<void> {
    if (this.consumers.has(topic)) return;

    const consumer = this.kafka.consumer({
      groupId: `${process.env.KAFKA_GROUP_ID || "anti-fraud-group"}-${topic}`,
    });

    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    await consumer.run({
      eachMessage: async ({ message }) => {
        const payload = message?.value
          ? JSON.parse(message.value.toString())
          : {};
        await onMessage(payload);
      },
    });

    this.consumers.set(topic, consumer);
  }
}
