type UseSyncPublisher = <T>(arg: T) => void;

interface UseSyncSubscriptionRef {
  current: UseSyncSubscription;
}

interface UseSyncChannel {
  bc: BroadcastChannel;
  namespace: string;
  subscriptions: UseSyncSubscriptionCollection;
  mount: VoidFunction;
  unmount: VoidFunction;
  handleMessage: (e: MessageEvent) => void;
  subscribe: (listener: EventListener) => UseSyncSubscription;
  unsubscribe: (subscription: UseSyncSubscription) => void;
  createPublisher: (id: string) => UseSyncPublisher;
}

interface UseSyncSubscription {
  id: string;
  namespace: string;
  listener: EventListener;
  channel: UseSyncChannel;
  publish: <T>(arg: T) => void;
}

interface UseSyncSubscriptionCollection {
  [id: string]: UseSyncSubscription;
}

interface UseSyncMessage {
  originId: string;
  content: {};
}

interface UseSyncChannelsCollection {
  [namespace: string]: UseSyncChannel;
}
