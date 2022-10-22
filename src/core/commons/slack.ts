import { Logger } from '@nestjs/common';

import { ConfigService } from './../../shared/services/config.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const SlackNode = require('slack-node');

export class Slack {
  constructor(protected readonly e: Error) {}

  async report(): Promise<void> {
    const env = new ConfigService();
    const webhookSlack =
      env.get('WEBHOOK_SLACK') ||
      'https://hooks.slack.com/services/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';
    const channelSlack =
      `#${env.get('WEBHOOK_SLACK_CHANNEL')}` || '#solva-mall';
    const usernameSlack = 'SOLVAMALL LOG ERROR';

    const slack = new SlackNode();
    slack.setWebhook(webhookSlack);
    slack.webhook(
      {
        channel: channelSlack,
        username: usernameSlack,
        text: `👮 ERROR LOG FROM \"${env.get('NODE_ENV')}.${env.get(
          'SERVICES',
        )}\"\n\n ${this.e}\n \n stack : ${this.e?.stack}`,
      },
      function (error) {
        if (error) {
          console.log(error);
        }
      },
    );
    Logger.error(this.e);
  }
}

export class SlackLogger {
  constructor(protected readonly e: string) {}

  async logger(): Promise<void> {
    const env = new ConfigService();
    const webhookSlack =
      env.get('WEBHOOK_SLACK') ||
      'https://hooks.slack.com/services/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';
    const channelSlack =
      `#${env.get('WEBHOOK_SLACK_CHANNEL')}` || '#solva-mall';
    const usernameSlack = 'AGENDA SOLVAMALL LOG';

    const slack = new SlackNode();
    slack.setWebhook(webhookSlack);
    slack.webhook(
      {
        channel: channelSlack,
        username: usernameSlack,
        icon_emoji: ':ghost:',
        text: `👮 LOG FROM \"${env.get('NODE_ENV')}.${env.get(
          'SERVICES',
        )}\"\n\n ${this.e}\n \n`,
      },
      function (error) {
        if (error) {
          console.log(error);
        }
      },
    );
    Logger.log(this.e);
  }
}
