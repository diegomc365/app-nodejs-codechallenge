import { Module } from '@nestjs/common';
import { KafkaMessagingAdapter } from '../adapters/kafka.messaging.adapter';

@Module({
  providers: [KafkaMessagingAdapter],
  exports: [KafkaMessagingAdapter], // <-- importante
})
export class KafkaModule {}