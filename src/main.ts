import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
  NestExpressApplication,
  ExpressAdapter,
} from '@nestjs/platform-express';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { AppModule } from './main/app.module';
import { SharedModule } from './shared.module';
import { ElasticsearchService } from './shared/elasticsearch/elasticsearch.service';
import { ConfigService } from './shared/services/config.service';
import { setupSwagger } from './viveo-swagger';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  const configService = app.select(SharedModule).get(ConfigService);
  // const elasticsearchService = app
  //   .select(SharedModule)
  //   .get(ElasticsearchService);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      validationError: {
        target: false,
      },
    }),
  );
  if (['development', 'staging'].includes(configService.nodeEnv)) {
    setupSwagger(app);
}
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
