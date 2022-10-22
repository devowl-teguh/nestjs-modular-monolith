import { Inject, Injectable } from '@nestjs/common';
import { ClientRedis } from '@nestjs/microservices';
import { timeout } from 'rxjs/operators';
import { MessageCodeError } from '../../core/commons/error-message/message-code-error';

import { AllChannel } from '../../core/commons/redis-channel-index';

import { ConfigService } from '../services/config.service';
import { GeneratorService } from '../services/generator.service';
import { REDIS_TRANSPORT } from './redis.constant';

interface ISendOptions {
  timeout?: number;
}

@Injectable()
export class RedisTransportService {
  constructor(
    @Inject(REDIS_TRANSPORT)
    private readonly redisTransport: ClientRedis,
    private readonly configService: ConfigService,
    private readonly generator: GeneratorService,
  ) {}

  async send<T = any>(
    channel: string,
    data: any,
    options?: ISendOptions,
  ): Promise<T> {
    const timeoutEnv =
      (options || {}).timeout ||
      this.configService.getNumber('REDIS_TRANSPORT_TIMEOUT') ||
      10000;
    const sendData = this.redisTransport
      .send(channel, data)
      .pipe(timeout(timeoutEnv));
    return await sendData.toPromise();
  }

  async emit(channel: string, data: any): Promise<void> {
    await this.redisTransport.emit(channel, data);
  }

  async sendMessage(
    channel: AllChannel[keyof AllChannel],
    data: any,
    queries: any,
    params: any,
  ): Promise<any> {
    try {
      const messageData = {
        referenceNumber: this.generator.uuid(),
        body: data,
        queries: queries,
        params: params,
        messageType: channel,
        topicName: channel,
      };
      const response = await this.send(channel, messageData);
      return response;
    } catch (error) {
      throw new MessageCodeError(error);
    }
  }
}
