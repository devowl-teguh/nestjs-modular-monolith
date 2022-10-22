import * as moment from 'moment';

import { ConfigService } from '../services/config.service';
const configService = new ConfigService();

export const ELASTICSEARCH = {
  URL: `http://${configService.get('ELASTICSEARCH_HOST')}:${configService.get(
    'ELASTICSEARCH_PORT',
  )}/`,
  INDEX: `${configService.get('ELASTICSEARCH_INDEX')}.${moment().format(
    'YYYY-MM-DD',
  )}`,
  TYPE: configService.get('ELASTICSEARCH_TYPE'),
  USERNAME: configService.get('ELASTICSEARCH_USERNAME'),
  PASSWORD: configService.get('ELASTICSEARCH_PASSWORD'),
};
