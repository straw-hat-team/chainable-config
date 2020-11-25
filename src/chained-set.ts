import { Chainable } from './chainable';
import { Configurable } from './configurable';

export class ChainedSet<P, S = unknown> extends Chainable<P> {
  private store = new Set<S>();

  add<T extends S>(value: T) {
    this.store.add(value);
    return this;
  }

  prepend<T extends S>(value: T) {
    this.store = new Set([value, ...this.store]);
    return this;
  }

  clear() {
    this.store.clear();
    return this;
  }

  delete<T extends S>(value: T) {
    this.store.delete(value);
    return this;
  }

  values() {
    return this.store.values();
  }

  has<T extends S>(value: T) {
    return this.store.has(value);
  }

  merge<T extends S>(values: T[]) {
    this.store = new Set([...this.store, ...values]);
    return this;
  }

  toConfig() {
    return Array.from(this.values()).map(Configurable.getConfig);
  }
}
