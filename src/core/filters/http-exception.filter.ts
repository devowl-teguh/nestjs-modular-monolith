import { ServerResponse } from 'http';

import {
  ExceptionFilter,
  Catch,
  HttpException,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { ConfigService } from '../../shared/services/config.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Slack = require('slack-node');

const env = new ConfigService();
const webhookSlack =
  env.get('WEBHOOK_SLACK') ||
  'https://hooks.slack.com/services/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';
const channelSlack = `#${env.get('WEBHOOK_SLACK_CHANNEL')}` || '#solva-mall';
const usernameSlack = 'SOLVAMALL LOG ERROR';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(error: Error, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const request = host.switchToHttp().getRequest();
    const status =
      error instanceof HttpException
        ? error.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const resp =
      error instanceof HttpException
        ? error.getResponse()
        : {
            statusCode: 500,
            status: false,
            message:
              'The value of the parameter you have provided is not valid. If you have some specific inquiries related, please contact our tech team',
          };
    if (response instanceof ServerResponse) {
      return response
        .writeHead(HttpStatus.UNAUTHORIZED, {
          'Content-Type': 'application/json',
        })
        .end(JSON.stringify(resp));
    }
    if (status === 500) {
      // log to slack
      const slack = new Slack();
      slack.setWebhook(webhookSlack);
      slack.webhook(
        {
          channel: channelSlack,
          username: usernameSlack,
          text: `👮 SOLVA MALL ERROR LOG FROM \"${env.get(
            'NODE_ENV',
          )}.${env.get('SERVICES')}\"\n\n${error}\n url : ${request.hostname}${
            request.url
          } \n method : ${request.method} \n stack : ${error.stack}`,
        },
        function (error) {
          if (error) {
            console.log(error);
          }
        },
      );
    }
    return response.status(status).send(resp);
  }
}
