class EventEmitter {
  private events: { [eventName: string]: ((...args: any[]) => void)[] };

  constructor() {
    this.events = {};
  }

  on(eventName: string, callback: (...args: any[]) => void) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  off(eventName: string, callback: (...args: any[]) => void) {
    if (this.events[eventName]) {
      this.events[eventName] = this.events[eventName].filter(
        (cb) => cb !== callback
      );
    }
  }

  emit(eventName: string, ...args: any[]) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((callback) => callback(...args));
    }
  }
}

const eventEmitter = new EventEmitter();

export default eventEmitter;
