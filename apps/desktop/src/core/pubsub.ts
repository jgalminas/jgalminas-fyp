
export type PubSubCallback<T extends Record<string, (...args: any) => void>, E extends keyof T> = (...args: Parameters<T[E]>) => void;

export class PubSub<T extends Record<string, (...args: any) => void>> {

  private subscribers: Record<keyof T, PubSubCallback<T, keyof T>[]> = {} as Record<keyof T, PubSubCallback<T, keyof T>[]>;

  on = <E extends keyof T>(event: E, callback: PubSubCallback<T, E>) => {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(callback);
  }

  unsubscribe = <E extends keyof T>(event: E, callback: PubSubCallback<T, E>) => {
    this.subscribers[event].filter((sub) => sub !== callback);
  }

  emit = <E extends keyof T>(event: E, ...args: Parameters<T[E]>) => {
    this.subscribers[event].forEach((callback) => callback(...args));
  }

}