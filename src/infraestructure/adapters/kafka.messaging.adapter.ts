// src/infrastructure/adapters/kafka.messaging.adapter.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, logLevel, Consumer } from 'kafkajs';
import { MessagingPort } from '../../domain/ports/messaging.port';

@Injectable()
export class KafkaMessagingAdapter implements MessagingPort, OnModuleInit {
  private kafka = new Kafka({
    clientId: process.env.KAFKA_CLIENT_ID || 'transactions-api',
    brokers: (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(','),
    logLevel: logLevel.NOTHING,
  });

  private producer = this.kafka.producer();
  private consumers = new Map<string, Consumer>();

  async onModuleInit() {
    console.log('[KAFKA] adapter init');
    await this.producer.connect();

    // Anti-fraude simulado
    await this.subscribe('transaction.created', async (payload) => {
      console.log('[AF] received created', payload);
      const status = payload.value > 1000 ? 'rejected' : 'approved';
      console.log(
        '[AF] decide',
        payload.transactionId,
        payload.value,
        '->',
        status,
      );
      await this.publish('transaction.status.updated', {
        transactionId: payload.transactionId,
        status,
      });
    });
  }

  async publish(topic: string, message: any): Promise<void> {
    console.log('[PUB]', topic, message);
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
  }

  async subscribe(
    topic: string,
    onMessage: (payload: any) => Promise<void>,
  ): Promise<void> {
    if (this.consumers.has(topic)) return;

    // 👇 usa un groupId UNICO por tópico para evitar interferencias
    const groupId = `${process.env.KAFKA_GROUP_ID || 'transactions-api'}-${topic}`;

    const consumer = this.kafka.consumer({ groupId });
    await consumer.connect();
    await consumer.subscribe({ topic, fromBeginning: false });
    console.log(
      '[SUBSCRIBE] connected & subscribed to',
      topic,
      'group',
      groupId,
    );

    await consumer.run({
      eachMessage: async ({ message }) => {
        const payload = message?.value
          ? JSON.parse(message.value.toString())
          : {};
        console.log('[SUB]', topic, payload);
        await onMessage(payload);
      },
    });

    this.consumers.set(topic, consumer);
    console.log('[SUBSCRIBE] running', topic);
  }
}
