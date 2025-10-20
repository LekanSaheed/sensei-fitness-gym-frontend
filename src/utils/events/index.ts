class EventEmitter {
  private events: { [eventName: string]: ((...args: unknown[]) => void)[] };

  constructor() {
    this.events = {};
  }

  on(eventName: string, callback: (...args: unknown[]) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: (...args: unknown[]) => void) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(eventName: string, ...args: unknown[]) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(...args));
    }
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
