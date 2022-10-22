import { Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import * as moment from 'moment';

import { ISwaggerConfigInterface } from '../../core/interfaces/swagger-config.interface';
interface UnifiedTopology {
  useUnifiedTopology: boolean;
}
interface MongoConfig {
  uri: string;
  options: UnifiedTopology;
}

interface AgendaConfig {
  address: string;
  collection: string;
  options: UnifiedTopology;
}

export class ConfigService {
  constructor() {
    const BUILD_ENV = process.env.BUILD_ENV || 'local';
    dotenv.config({
      path: BUILD_ENV === 'local' ? `.env` : `.env.${BUILD_ENV}`,
    });

    // Replace \\n with \n to support multiline strings
    for (const envName of Object.keys(process.env)) {
      process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
    }
    if (this.nodeEnv === 'development') {
      // console.info(process.env);
    }
  }

  public get(key: string): string {
    if (process.env[key] == 'endOfDay') {
      return this.convertJWTExpirationTime('JWT_EXPIRATION_TIME');
    }

    return process.env[key];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public convertJWTExpirationTime(key: string): string {
    const currentDate = new Date();
    const now = moment(currentDate).format('YYYY-MM-DD HH:mm:ss');
    const getDay = moment(currentDate).format('YYYY-MM-DD');
    const end = moment(`${getDay} 23:59:59`); // another date
    const duration = moment.duration(end.diff(now));
    return `${duration.asMinutes().toString()}m`;
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  get nodeEnv(): string {
    return this.get('NODE_ENV') || 'development';
  }

  get isSynchronize(): string {
    return this.get('IS_SYNCHRONIZE') || 'true';
  }

  get host(): string {
    return this.get('HOST') || 'localhost';
  }

  get port(): number {
    return this.getNumber('PORT') || 3000;
  }

  get swaggerConfig(): ISwaggerConfigInterface {
    return {
      path: this.get('SWAGGER_PATH') || '/api/docs',
      title: this.get('SWAGGER_TITLE') || 'Member ID API',
      description: this.get('SWAGGER_DESCRIPTION'),
      version: this.get('SWAGGER_VERSION') || '0.0.1',
      scheme: this.get('SWAGGER_SCHEME') === 'https' ? 'https' : 'http',
    };
  }

  get typeOrmConfig(): TypeOrmModuleOptions {
    let entities = [__dirname + '/../../modules/**/entities/*.entity{.ts,.js}'];
    let migrations = [__dirname + '/../../migrations/*{.ts,.js}'];

    if ((module as any).hot) {
      const entityContext = (require as any).context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext(id);
        const [entity] = Object.values(entityModule);
        return entity;
      });
      const migrationContext = (require as any).context(
        './../../migrations',
        false,
        /\.ts$/,
      );
      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext(id);
        const [migration] = Object.values(migrationModule);
        return migration;
      });
    }
    return {
      entities,
      migrations,
      keepConnectionAlive: true,
      type: 'mysql',
      host: this.get('MYSQL_HOST'),
      port: this.getNumber('MYSQL_PORT'),
      username: this.get('MYSQL_USERNAME'),
      password: this.get('MYSQL_PASSWORD'),
      database: this.get('MYSQL_DATABASE'),
      migrationsRun: false,
      synchronize: this.isSynchronize === 'true',
      logging: this.nodeEnv === 'development',
      charset: 'utf8mb4_general_ci',
      extra: {
        charset: 'utf8mb4_general_ci',
      },
    };
  }

  /**
   * getConfigAgenda
   */
  public getConfigAgenda(): AgendaConfig {
    let address = `mongodb://${this.get('MONGO_USERNAME')}:${this.get(
      'MONGO_PASSWORD',
    )}@${this.get('MONGO_HOST')}:${this.get('MONGO_PORT')}/${this.get(
      'MONGO_DATABASE',
    )}`;
    if (this.get('MONGO_HOST') === 'localhost') {
      address = `mongodb://${this.get('MONGO_HOST')}:${this.get(
        'MONGO_PORT',
      )}/${this.get('MONGO_DATABASE')}`;
    }
    return {
      address,
      collection: this.get('AGENDA_COLLECTION'),
      options: { useUnifiedTopology: true },
    };
  }

  public mongoConfig(): MongoConfig {
    let address = `mongodb://${this.get('MONGO_USERNAME')}:${this.get(
      'MONGO_PASSWORD',
    )}@${this.get('MONGO_HOST')}:${this.get('MONGO_PORT')}/${this.get(
      'MONGO_DATABASE',
    )}`;
    if (this.get('MONGO_HOST') === 'localhost') {
      address = `mongodb://${this.get('MONGO_HOST')}:${this.get(
        'MONGO_PORT',
      )}/${this.get('MONGO_DATABASE')}`;
    }
    return { uri: address, options: { useUnifiedTopology: true } };
  }

  get redisConfig(): any {
    return {
      host: this.get('REDIS_HOST'),
      port: this.get('REDIS_PORT'),
      ttl: this.get('REDIS_TTL'),
      environment: this.get('REDIS_ENVIRONMENT'),
    };
  }

  public getMicroserviceRedisConfig(): any {
    const url = `redis://${this.get('REDIS_HOST')}:${this.get('REDIS_PORT')}`;
    return {
      transport: Transport.REDIS,
      options: { url },
      transportName:
        this.get('REDIS_TRANSPORT_NAME') || 'manggis-development-loyalty',
      transportExpireCache: this.getNumber('REDIS_TRANSPORT_EXPIRE') || 60,
    };
  }

  public getActiveModules(): string[] {
    return Object.keys(process.env).filter(
      (key) =>
        key.endsWith('_MODULE') && (process.env[key] + '').trim() === 'true',
    );
  }

  public getSendPushNotificationEnv(): boolean {
    const getPushNotif: boolean =
      this.get('PUSH_NOTIFICATION_ENABLED') === 'false' ? false : true;
    return getPushNotif;
  }
}
