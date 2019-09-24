import { useEffect, useRef } from 'react';
import SyncChannel from './SyncChannel';

interface ChannelsCollection {
  [namespace: string]: SyncChannel;
}

class ChannelStore {
  channels: ChannelsCollection = {};

  formatNamespace = (namespace: string): string => {
    return `react-use-sync:${namespace}`;
  };

  subscribeTo = (namespace: string): SyncChannel => {
    const formattedName = this.formatNamespace(namespace);
    let syncChannel: SyncChannel = this.channels[formattedName] || null;
    if (!syncChannel) {
      syncChannel = this.createChannel(formattedName);
    }
    // subscribe to the sync channel
    // ...
    return syncChannel;
  };

  createChannel = (formattedName: string): SyncChannel => {
    const syncChannel = new SyncChannel(formattedName);
    this.channels[formattedName] = syncChannel;
    return this.channels[formattedName];
  };
}

const channelStore: ChannelStore = new ChannelStore();

function useChannel(namespace: string): SyncChannel {
  const channelRef: any = useRef({ id: null, channel: null });
  useEffect(() => {
    // const channel = channelStore.add(namespace);
    // channelRef.current = channel;
  }, []);
  return channelRef.current;
}

function useSync(signature: [any, (any) => any], namespace: string): [any, (any) => any] {
  const [val, setVal] = signature;
  const channel = useChannel(namespace);
  // TODO: broadcast messages each time state changes

  // TODO: fire local setter any time new postMessage comes in

  return [val, setVal];
}

export default useSync;
