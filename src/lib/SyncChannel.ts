import { uuid } from './util';

interface Subscription {
  id: string;
  listener: EventListener;
}

class SyncChannel {
  bc: BroadcastChannel = null;
  subscriptions: Array<Subscription> = [];

  constructor(bc) {
    this.bc = bc;
  }

  mount = () => {
    this.bc.addEventListener('message', this.handleMessage);
  };

  unmount = () => {
    this.bc.removeEventListener('message', this.handleMessage);
  };

  handleMessage: EventListener = (...args) => {
    this.subscriptions.forEach(subscription => {
      const [e] = args;
      // if event didn't originate from subscription, fire listener
    });
  };

  subscribe = (listener: EventListener): SyncChannel => {
    const subscription = {
      id: uuid(),
      listener
    };
    this.subscriptions.push(subscription);
    return this;
  };
}

export default SyncChannel;
