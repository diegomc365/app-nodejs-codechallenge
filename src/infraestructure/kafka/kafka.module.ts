import { Global, Module } from '@nestjs/common';
import { KafkaMessagingAdapter } from '../adapters/kafka.messaging.adapter';

@Global()
@Module({
  providers: [KafkaMessagingAdapter],
  exports: [KafkaMessagingAdapter],
})
export class KafkaModule {}
