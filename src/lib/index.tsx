import { useEffect, useRef } from 'react';

interface ChannelsCollection {
  [namespace: string]: BroadcastChannel;
}

class ChannelStore {
  channels: ChannelsCollection = {};

  add = (namespace: string): BroadcastChannel => {
    if (this.channels[namespace]) return;
    const bc: BroadcastChannel = new BroadcastChannel(namespace);
    this.channels[namespace] = bc;
    return bc;
  };
}

const channelStore: ChannelStore = new ChannelStore();

function useSync(signature: [any, (any) => any], namespace: string): [any, (any) => any] {
  const [val, setVal] = signature;
  const channel: any = useRef();

  useEffect(() => {
    const bc = channelStore.add(namespace);
    channel.current = bc;
  }, []);

  // TODO: broadcast messages each time state changes

  // TODO: fire local setter any time new postMessage comes in

  return [val, setVal];
}

export default useSync;
