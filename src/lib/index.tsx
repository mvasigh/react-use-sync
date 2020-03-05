import { useEffect, useRef, useCallback } from 'react';
import SyncChannel from './SyncChannel';
import { SUPPORTS_BROADCAST_CHANNEL } from './util';

class ChannelStore {
  channels: UseSyncChannelsCollection = {};

  formatNamespace = (namespace: string): string => {
    return `react-use-sync:${namespace}`;
  };

  subscribe = (namespace: string, onMessage: EventListener): UseSyncSubscription => {
    const formattedName = this.formatNamespace(namespace);
    let syncChannel: UseSyncChannel = this.channels[formattedName] || null;
    if (!syncChannel) {
      syncChannel = this.createChannel(formattedName);
    }
    const subscription = syncChannel.subscribe(onMessage);
    return subscription;
  };

  unsubscribe = (subscription: UseSyncSubscription): void => {
    subscription.channel.unsubscribe(subscription);
    const channel = this.channels[subscription.namespace];
    if (!channel || !Object.keys(channel.subscriptions).length) {
      delete this.channels[subscription.namespace];
    }
  };

  createChannel = (formattedName: string): UseSyncChannel => {
    const syncChannel = new SyncChannel(formattedName);
    this.channels[formattedName] = syncChannel;
    return this.channels[formattedName];
  };
}

const channelStore: ChannelStore = new ChannelStore();

function useSubscription(namespace: string, onMessage: EventListener): UseSyncSubscription {
  const subscriptionRef: UseSyncSubscriptionRef = useRef();

  useEffect(() => {
    if (!SUPPORTS_BROADCAST_CHANNEL) return;

    const subscription = channelStore.subscribe(namespace, onMessage);
    subscriptionRef.current = subscription;
    return (): void => channelStore.unsubscribe(subscription);
  }, [namespace, onMessage]);

  if (!SUPPORTS_BROADCAST_CHANNEL) return null;

  return subscriptionRef.current;
}

function useSync<T>(namespace: string, signature: [T, (arg: T) => void]): [T, (arg: T) => void] {
  const [val, setVal] = signature;
  const handleMessage = useCallback(
    e => {
      setVal(e.data.content);
    },
    [setVal]
  );

  // open the subscription
  const subscription = useSubscription(namespace, handleMessage);

  // broadcast messages each time state changes
  const setter = (val: T): void => {
    if (subscription) {
      subscription.publish(val);
    }
    return setVal(val);
  };

  return [val, setter];
}

export default useSync;
