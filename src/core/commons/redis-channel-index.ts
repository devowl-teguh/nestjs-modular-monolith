import { RedisChannelSubscriber } from './redis-channel-subscriber';

const allChannel = {
  ...RedisChannelSubscriber,
};
export type AllChannel = typeof allChannel;
