import { Global, Module } from '@nestjs/common';
import { ACTIVE_MODULES } from './modules';
import { REDIS_TRANSPORT } from './shared/redis/redis.constant';
import { ConfigService } from './shared/services/config.service';
import { ClientProxyFactory } from '@nestjs/microservices';

const providers = [
  ConfigService,
  {
    provide: REDIS_TRANSPORT,
    useFactory: (configService: ConfigService) => {
      const options = configService.getMicroserviceRedisConfig();
      const redis = ClientProxyFactory.create(options);
      redis.connect();
      return redis;
    },
    inject: [ConfigService],
  },
];

@Global()
@Module({
  providers,
  imports: [...ACTIVE_MODULES],
  exports: [...providers],
})
export class SharedModule {}
