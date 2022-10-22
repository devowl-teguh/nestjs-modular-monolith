import { ConfigService } from '../../shared/services/config.service';

const configService = new ConfigService();
const redisEnvironment =
  `${configService.get('REDIS_ENVIRONMENT')}.modular-` || '';

export const RedisChannelSubscriber = {
  // Member
  MOBILE_LOGIN: `${redisEnvironment}mobile.login`,
};
