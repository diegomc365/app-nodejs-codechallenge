export abstract class MessagingPort {
  abstract publish(topic: string, message: any): Promise<void>;
  abstract subscribe(
    topic: string,
    onMessage: (payload: any) => Promise<void>,
  ): Promise<void>;
}
