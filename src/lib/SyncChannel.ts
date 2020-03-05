import { uuid } from './util';

class SyncChannel implements UseSyncChannel {
  bc: BroadcastChannel = null;
  namespace: string = null;
  subscriptions: UseSyncSubscriptionCollection = {};

  constructor(namespace: string) {
    this.bc = new BroadcastChannel(namespace);
    this.namespace = namespace;
    this.mount();
  }

  mount = (): void => {
    this.bc.addEventListener('message', this.handleMessage);
  };

  unmount = (): void => {
    this.bc.removeEventListener('message', this.handleMessage);
    this.bc.close();
  };

  handleMessage = (e: MessageEvent): void => {
    Object.entries(this.subscriptions).forEach(([id, sub]) => {
      if (e.data.originId === id) return;
      sub.listener(e);
    });
  };

  subscribe = (listener: EventListener): UseSyncSubscription => {
    const id = uuid();
    const namespace = this.namespace;
    const subscription: UseSyncSubscription = {
      id,
      namespace,
      listener,
      channel: this,
      publish: this.createPublisher(id)
    };
    this.subscriptions[id] = subscription;
    return subscription;
  };

  unsubscribe = (subscription: UseSyncSubscription): void => {
    const { id } = subscription;
    if (this.subscriptions[id]) {
      delete this.subscriptions[id];
    }
    if (!Object.keys(this.subscriptions).length) {
      this.unmount();
    }
  };

  createPublisher = (id: string): UseSyncPublisher => <T>(message: T): void => {
    return this.bc.postMessage({
      originId: id,
      content: message
    });
  };
}

export default SyncChannel;
