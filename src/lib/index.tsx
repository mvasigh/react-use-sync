import { useEffect, useRef, useCallback } from 'react';
import SyncChannel, { Subscription } from './SyncChannel';

interface SubscriptionRef {
  current: Subscription;
}

interface ChannelsCollection {
  [namespace: string]: SyncChannel;
}

type UseStateSignature = [any, (any) => void];

class ChannelStore {
  channels: ChannelsCollection = {};

  formatNamespace = (namespace: string): string => {
    return `react-use-sync:${namespace}`;
  };

  subscribe = (namespace: string, onMessage: EventListener): Subscription => {
    const formattedName = this.formatNamespace(namespace);
    let syncChannel: SyncChannel = this.channels[formattedName] || null;
    if (!syncChannel) {
      syncChannel = this.createChannel(formattedName);
    }
    const subscription = syncChannel.subscribe(onMessage);
    return subscription;
  };

  unsubscribe = (subscription: Subscription): void => {
    subscription.channel.unsubscribe(subscription);
    const channel = this.channels[subscription.namespace];
    if (!channel || !Object.keys(channel.subscriptions).length) {
      delete this.channels[subscription.namespace];
    }
  };

  createChannel = (formattedName: string): SyncChannel => {
    const syncChannel = new SyncChannel(formattedName);
    this.channels[formattedName] = syncChannel;
    return this.channels[formattedName];
  };
}

const channelStore: ChannelStore = new ChannelStore();

function useSubscription(namespace: string, onMessage: EventListener): Subscription {
  const subscriptionRef: SubscriptionRef = useRef();
  useEffect(() => {
    const subscription = channelStore.subscribe(namespace, onMessage);
    subscriptionRef.current = subscription;
    return (): void => channelStore.unsubscribe(subscription);
  }, [namespace, onMessage]);
  return subscriptionRef.current;
}

function useSync(namespace: string, signature: UseStateSignature): UseStateSignature {
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
  const setter = (val): void => {
    if (subscription) {
      subscription.publish(val);
    }
    setVal(val);
  };

  return [val, setter];
}

export default useSync;
