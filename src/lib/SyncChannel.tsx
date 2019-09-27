import { uuid } from './util';

export interface Subscription {
  id: string;
  namespace: string;
  listener: EventListener;
  channel: SyncChannel;
  publish: (Message) => void;
}

interface SubscriptionCollection {
  [id: string]: Subscription;
}

interface Message {
  originId: string;
  // eslint-disable-next-line
  content: any;
}

type Publisher = (Message) => void;

class SyncChannel {
  bc: BroadcastChannel = null;
  namespace: string = null;
  subscriptions: SubscriptionCollection = {};

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

  subscribe = (listener: EventListener): Subscription => {
    const id = uuid();
    const namespace = this.namespace;
    const subscription = {
      id,
      namespace,
      listener,
      channel: this,
      publish: this.publish(id)
    };
    this.subscriptions[id] = subscription;
    return subscription;
  };

  unsubscribe = (subscription: Subscription): void => {
    const { id } = subscription;
    if (this.subscriptions[id]) {
      delete this.subscriptions[id];
    }
    if (!Object.keys(this.subscriptions).length) {
      this.unmount();
    }
  };

  publish = (id: string): Publisher => (message: Message): void => {
    return this.bc.postMessage({
      originId: id,
      content: message
    });
  };
}

export default SyncChannel;
